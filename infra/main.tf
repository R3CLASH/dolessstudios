# Do Less Studios on AWS: CloudFront → S3 (static files) + API Gateway (HTTP API) → Lambda (Next.js server and
# image optimizer), built with OpenNext (open-next.config.ts). Deployed by .github/workflows/deploy.yml.
#
# The state bucket and the GitHub Actions role are created once by ./bootstrap.sh.
# Local runs: AWS_PROFILE=thavisha terraform -chdir=infra plan (after `npm run build:aws`).

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
  name      = "doless"
  open_next = "${path.module}/../.open-next"

  # Without a custom domain the site lives on the CloudFront domain.
  site_url = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}
