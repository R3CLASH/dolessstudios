# Do Less Studios on AWS: CloudFront → S3 (static files) + API Gateway (HTTP API) → Lambda (Next.js server and
# image optimizer), built with OpenNext (open-next.config.ts).
#
# Two workflows, deliberately split:
#   .github/workflows/infra.yml   this directory. Validated on PRs, applied by hand (workflow_dispatch).
#   .github/workflows/deploy.yml  the app. Runs on every push to main and never invokes Terraform; it
#                                 reads what it needs from the SSM parameter in outputs.tf.
#
# Nothing here depends on build output, so a plan needs no `npm run build:aws`. Keep it that way.
#
# The state bucket and the GitHub Actions role are created once by ./bootstrap.sh.
# Local runs: AWS_PROFILE=thavisha terraform -chdir=infra plan

terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.6"
    }
  }

  backend "s3" {
    bucket       = "doless-tfstate-349631302124"
    key          = "prod/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "DoLessStudios"
      Environment = "prod"
      ManagedBy   = "terraform"
    }
  }
}

data "aws_caller_identity" "current" {}

locals {
  name = "doless"

  # The distribution serves the apex and www; canonical_host picks which one the build is baked against.
  site_hosts     = var.domain_name == "" ? [] : [var.domain_name, "www.${var.domain_name}"]
  canonical_host = var.canonical_host == "www" ? "www.${var.domain_name}" : var.domain_name

  # Without a custom domain the site lives on the CloudFront domain.
  site_url = var.domain_name != "" ? "https://${local.canonical_host}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}
