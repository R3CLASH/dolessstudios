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
  required_version = ">= 1.11" # value_wo on aws_ssm_parameter is a write-only argument

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.6"
    }
    neon = {
      source = "neondatabase/neon"
      # Exact pin, not a range, for two reasons: Terraform only installs a
      # prerelease when the version is pinned exactly, and this provider has no
      # stable release at all yet (see infra/database.tf). Never `init -upgrade`
      # this unattended -- CI runs a plain `init`, which is what Neon advises.
      version = "0.19.0-beta.4"
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

# An empty api_key is fine here as long as no Neon resource is instantiated, which
# is exactly what local.neon_enabled guarantees -- so `terraform validate` on the
# credential-less PR job keeps working.
provider "neon" {
  api_key = var.neon_api_key
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
