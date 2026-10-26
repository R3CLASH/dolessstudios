# Both bundles come from `npm run build:aws` (OpenNext, see open-next.config.ts).
data "archive_file" "server" {
  type        = "zip"
  source_dir  = "${local.open_next}/server-functions/default"
  output_path = "${path.module}/.build/server.zip"
}

data "archive_file" "image" {
  type        = "zip"
  source_dir  = "${local.open_next}/image-optimization-function"
  output_path = "${path.module}/.build/image.zip"
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
    },
    # Unset rather than empty, so the app's "not configured" checks read the same as locally.
    { for k, v in {
      SMTP_USER          = var.smtp_user
      SMTP_PASS          = var.smtp_pass
      CONTACT_FROM_EMAIL = var.contact_from_email
      DATABASE_URL       = var.database_url
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
  filename         = data.archive_file.server.output_path
  source_code_hash = data.archive_file.server.output_base64sha256
  memory_size      = 1024
  timeout          = 30 # API Gateway gives up at 30s anyway

  environment {
    variables = local.server_env
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
  filename         = data.archive_file.image.output_path
  source_code_hash = data.archive_file.image.output_base64sha256
  memory_size      = 1536
  timeout          = 30

  environment {
    variables = {
      BUCKET_NAME       = aws_s3_bucket.site.bucket
      BUCKET_KEY_PREFIX = "_assets"
    }
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
