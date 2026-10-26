# CloudFront in front of everything: /_next/static/* and public/ files from S3, /_next/image and pages through
# API Gateway to the Lambdas.
#
# The bucket holds OpenNext's build output, uploaded by the deploy workflow:
#   _assets/  .open-next/assets (hashed /_next/static and public/), CloudFront's S3 origin path
#   _cache/   .open-next/cache (prerendered pages per build ID), read by the server function

resource "aws_s3_bucket" "site" {
  bucket        = "${local.name}-site-${data.aws_caller_identity.current.account_id}"
  force_destroy = true # only build output; every deploy re-uploads it
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOAC"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.site.arn}/_assets/*"
      Condition = { StringEquals = { "AWS:SourceArn" = aws_cloudfront_distribution.site.arn } }
    }]
  })
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "${local.name}-site"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# API Gateway only answers to its own Host, so CloudFront must not forward the viewer's. It goes in
# x-forwarded-host instead, which OpenNext uses as the request host (and Next.js checks server action
# origins against). x-viewer-ip overwrites anything the viewer sent, so the form rate limit can trust it.
resource "aws_cloudfront_function" "forward_host" {
  name    = "${local.name}-forward-host"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = <<-EOT
    function handler(event) {
      var request = event.request;
      request.headers["x-forwarded-host"] = { value: request.headers.host.value };
      request.headers["x-viewer-ip"] = { value: event.viewer.ip };
      return request;
    }
  EOT
}

data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

# Pages are cached for as long as the server's Cache-Control allows (prerendered pages: until the next deploy,
# which invalidates everything). The headers are the ones Next.js varies RSC responses on.
resource "aws_cloudfront_cache_policy" "server" {
  name        = "${local.name}-server"
  min_ttl     = 0
  default_ttl = 0
  max_ttl     = 31536000

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["rsc", "next-router-prefetch", "next-router-state-tree", "next-router-segment-prefetch", "next-url"]
      }
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

# Optimized images vary on url/w/q and on Accept (AVIF/WebP).
resource "aws_cloudfront_cache_policy" "image" {
  name        = "${local.name}-image"
  min_ttl     = 0
  default_ttl = 0
  max_ttl     = 31536000

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = false
    enable_accept_encoding_gzip   = false

    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["accept"]
      }
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

locals {
  api_domain = trimprefix(aws_apigatewayv2_api.site.api_endpoint, "https://")

  # One behavior per top-level entry in public/, like the routes OpenNext lists in open-next.output.json.
  # Folders only match names with an extension: public/work/*.webp shares /work/ with the /work/[slug] pages.
  public_paths = distinct([
    for f in fileset("${local.open_next}/assets", "**") :
    (strcontains(f, "/") ? "/${split("/", f)[0]}/*.*" : "/${f}")
    if !startswith(f, "_next/") && f != "BUILD_ID"
  ])
}

resource "aws_cloudfront_distribution" "site" {
  enabled         = true
  is_ipv6_enabled = true
  http_version    = "http2and3"
  comment         = "Do Less Studios"
  price_class     = "PriceClass_100"
  aliases         = var.domain_name != "" ? [var.domain_name] : []

  origin {
    origin_id                = "s3"
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_path              = "/_assets"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  origin {
    origin_id   = "api"
    domain_name = local.api_domain

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  ordered_cache_behavior {
    path_pattern           = "/_next/static/*"
    target_origin_id       = "s3"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  ordered_cache_behavior {
    path_pattern             = "/_next/image*"
    target_origin_id         = "api"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = aws_cloudfront_cache_policy.image.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id
    viewer_protocol_policy   = "redirect-to-https"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.forward_host.arn
    }
  }

  dynamic "ordered_cache_behavior" {
    for_each = local.public_paths
    content {
      path_pattern           = ordered_cache_behavior.value
      target_origin_id       = "s3"
      allowed_methods        = ["GET", "HEAD"]
      cached_methods         = ["GET", "HEAD"]
      cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id
      compress               = true
      viewer_protocol_policy = "redirect-to-https"
    }
  }

  default_cache_behavior {
    target_origin_id         = "api"
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = aws_cloudfront_cache_policy.server.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id
    compress                 = true
    viewer_protocol_policy   = "redirect-to-https"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.forward_host.arn
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.acm_certificate_arn == ""
    acm_certificate_arn            = var.acm_certificate_arn != "" ? var.acm_certificate_arn : null
    ssl_support_method             = var.acm_certificate_arn != "" ? "sni-only" : null
    minimum_protocol_version       = var.acm_certificate_arn != "" ? "TLSv1.2_2021" : "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  lifecycle {
    precondition {
      condition     = (var.domain_name == "") == (var.acm_certificate_arn == "")
      error_message = "Set domain_name and acm_certificate_arn together."
    }
  }
}
