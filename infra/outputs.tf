output "site_url" {
  description = "The deploy workflow builds with this as NEXT_PUBLIC_SITE_URL."
  value       = local.site_url
}

output "site_bucket" {
  value = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.site.api_endpoint
}

# ── The contract with .github/workflows/deploy.yml ───────────────────────────
# That workflow deploys code only and never runs Terraform, so it can't use the outputs above.
# It reads this one parameter instead: a single JSON document, so it can't be observed half-written
# the way several parameters could if an apply died midway.
#
# public_paths is in here so the code workflow can tell that public/ changed without infra having
# been applied — see the drift guard in deploy.yml. Never put secrets in it: Standard-tier String
# parameters are readable by anything holding ssm:GetParameter.
resource "aws_ssm_parameter" "deploy_targets" {
  name        = "/${local.name}/deploy-targets"
  description = "Read by .github/workflows/deploy.yml. Written only by terraform apply."
  type        = "String"
  tier        = "Standard"

  value = jsonencode({
    site_url                   = local.site_url
    site_bucket                = aws_s3_bucket.site.bucket
    cloudfront_distribution_id = aws_cloudfront_distribution.site.id
    server_function            = aws_lambda_function.server.function_name
    image_function             = aws_lambda_function.image.function_name
    public_paths               = local.public_paths
  })
}
