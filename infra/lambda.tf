# This file owns the SHAPE of both functions (runtime, memory, env, routing) — never their code.
#
# The real bundles come from `npm run build:aws` (OpenNext, see open-next.config.ts) and are shipped
# by .github/workflows/deploy.yml with `aws lambda update-function-code`. Terraform creates each
# function from the placeholder below and then ignores the code attributes, so `terraform plan`
# needs no build and a code deploy needs no apply.
data "archive_file" "placeholder" {
  type        = "zip"
  source_dir  = "${path.module}/placeholder"
  output_path = "${path.module}/.build/placeholder.zip"
}

locals {
  server_env = merge(
    {
      CACHE_BUCKET_NAME       = aws_s3_bucket.site.bucket
      CACHE_BUCKET_KEY_PREFIX = "_cache"
      CACHE_BUCKET_REGION     = var.aws_region
      SMTP_HOST               = var.smtp_host
      SMTP_PORT               = var.smtp_port
      CONTACT_TO_EMAIL        = var.contact_to_email
      # Always set, never conditional: the Dodo SDK treats an absent environment
      # as live_mode, so leaving this out is how you charge real cards by accident.
      DODO_PAYMENTS_ENVIRONMENT = var.dodo_environment
    },
    # Unset rather than empty, so the app's "not configured" checks read the same as locally.
    { for k, v in {
      SMTP_USER          = var.smtp_user
      SMTP_PASS          = var.smtp_pass
      CONTACT_FROM_EMAIL = var.contact_from_email
      # Terraform owns this now: the Neon project in database.tf -> a SecureString
      # parameter -> read back through a data source, because this block cannot take
      # an ephemeral value. Unset when no Neon key is configured.
      DATABASE_URL = local.neon_enabled ? data.aws_ssm_parameter.database_url[0].value : ""
      # /admin's whole auth. Absent means the admin area 404s, which is the
      # same thing it does locally with the variable unset.
      ADMIN_PASSWORD = var.admin_password
      # Signs the order links in confirmation emails. Was missing here while it
      # sat in .env.example, so production shipped every confirmation email
      # without the buyer's order link.
      ORDER_LINK_SECRET = var.order_link_secret
      # No DODO_PAYMENTS_RETURN_URL here. Building it from local.site_url creates a
      # Terraform cycle (distribution -> apigw -> integration -> lambda env ->
      # distribution); the app derives it from SITE.url instead.
      DODO_PAYMENTS_API_KEY     = var.dodo_api_key
      DODO_PAYMENTS_WEBHOOK_KEY = var.dodo_webhook_key
      # In the conditional half with the rest of the optional values. testProductId()
      # coerces "" to null anyway, so this is consistency rather than a fix: an unset
      # variable should mean an unset env var, the same as it does locally.
      DODO_TEST_PRODUCT_ID = var.dodo_test_product_id
    } : k => v if v != "" },
  )
}

# ── Next.js server (pages, server actions) ───────────────────────────────────

resource "aws_cloudwatch_log_group" "server" {
  name              = "/aws/lambda/${local.name}-server"
  retention_in_days = 30
}

resource "aws_lambda_function" "server" {
  function_name    = "${local.name}-server"
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs24.x"
  architectures    = ["arm64"]
  handler          = "index.handler"
  filename         = data.archive_file.placeholder.output_path
  source_code_hash = data.archive_file.placeholder.output_base64sha256
  memory_size      = 1024
  timeout          = 30 # API Gateway gives up at 30s anyway

  environment {
    variables = local.server_env
  }

  # Code is shipped out of band (see the header). Because it is ignored here, ANY replacement of
  # this resource — -replace, taint, rename — resurrects the placeholder's 503; heal by re-running
  # the Deploy workflow. `runtime` and `architectures` are carried by CreateFunction and
  # UpdateFunctionCode rather than UpdateFunctionConfiguration, so changing either also needs a
  # Deploy run immediately after. Never add `publish` or an alias: versioning fights out-of-band
  # code updates, and the aws_lambda_permission blocks below target the unqualified name.
  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }

  depends_on = [aws_cloudwatch_log_group.server, aws_iam_role_policy.lambda]
}

# ── Image optimizer (/_next/image) ───────────────────────────────────────────

resource "aws_cloudwatch_log_group" "image" {
  name              = "/aws/lambda/${local.name}-image"
  retention_in_days = 30
}

resource "aws_lambda_function" "image" {
  function_name    = "${local.name}-image"
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs24.x"
  architectures    = ["arm64"] # OpenNext installs sharp for linux-arm64
  handler          = "index.handler"
  filename         = data.archive_file.placeholder.output_path
  source_code_hash = data.archive_file.placeholder.output_base64sha256
  memory_size      = 1536
  timeout          = 30

  environment {
    variables = {
      BUCKET_NAME       = aws_s3_bucket.site.bucket
      BUCKET_KEY_PREFIX = "_assets"
    }
  }

  # Same as the server function above: code is shipped by the Deploy workflow, not Terraform.
  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }

  depends_on = [aws_cloudwatch_log_group.image, aws_iam_role_policy.lambda]
}

# ── API Gateway ──────────────────────────────────────────────────────────────
# One HTTP API in front of both functions. Responses are buffered, so each is capped at 6 MB, which this site's
# pages and optimized images are far below.

resource "aws_apigatewayv2_api" "site" {
  name          = local.name
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "server" {
  api_id                 = aws_apigatewayv2_api.site.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.server.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "image" {
  api_id                 = aws_apigatewayv2_api.site.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.image.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "image" {
  api_id    = aws_apigatewayv2_api.site.id
  route_key = "GET /_next/image"
  target    = "integrations/${aws_apigatewayv2_integration.image.id}"
}

resource "aws_apigatewayv2_route" "server" {
  api_id    = aws_apigatewayv2_api.site.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.server.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.site.id
  name        = "$default"
  auto_deploy = true

  # CloudFront absorbs normal traffic; this caps what a flood that gets past it can cost.
  default_route_settings {
    throttling_burst_limit = 200
    throttling_rate_limit  = 100
  }
}

resource "aws_lambda_permission" "server" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.server.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.site.execution_arn}/*/*"
}

resource "aws_lambda_permission" "image" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.image.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.site.execution_arn}/*/*"
}
