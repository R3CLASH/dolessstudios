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
