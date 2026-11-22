# Neon serverless Postgres: the build queue behind /admin (orders + leads), plus
# contact briefs and newsletter sign-ups.
#
# Why Neon and not RDS. The server Lambda is deliberately NOT in a VPC, and
# deploy.yml runs `npm run db:migrate` from a GitHub runner. A private RDS would
# need a NAT gateway for the Lambda's outbound Dodo and SMTP calls AND a
# VPC-attached migration runner, which is a deploy.yml redesign. Neon is a public
# TLS endpoint that scales to zero, so both paths keep working unchanged, the
# Lambda stays out of a VPC, and the free plan costs nothing.
#
# Optional like every other integration here: with neon_api_key unset nothing
# below is created, DATABASE_URL stays off the Lambda, and the app degrades the
# way it does locally -- /admin renders <NoDatabase />, briefs are only emailed.
# Nothing throws and nothing half-works.

locals {
  # nonsensitive() because neon_api_key is sensitive and that taint propagates
  # through the comparison. Terraform then refuses the bool in a `count` and in
  # the database_configured output. Whether a key is set leaks nothing; the key
  # itself is never unwrapped here.
  neon_enabled = nonsensitive(var.neon_api_key != "")
}

resource "neon_project" "main" {
  count = local.neon_enabled ? 1 : 0

  name       = local.name
  region_id  = "aws-us-east-1" # the Lambda's region, so queries stay on one coast
  pg_version = 17              # matches docker-compose.yml (postgres:17-alpine)

  database_name = "doless"
  database_user = "doless"

  # 6 hours. This is the Free plan's ceiling -- the provider's own "default: 1 day"
  # is the PAID default, and asking a Free project for 86400 is asking for more
  # history than the plan allows. Raise this to 86400 on a paid plan.
  history_retention_seconds = 21600

  primary_compute = {
    # Free allows up to 2 CU; this stays well inside it.
    autoscaling_limit_min_cu = 0.25
    autoscaling_limit_max_cu = 1
    # 0 means "take the plan default", which is the only correct value on Free:
    # scale-to-zero there is fixed at 5 minutes and cannot be turned off or
    # retimed. Setting an explicit timeout is a paid-plan feature. The first
    # query after a suspend pays roughly 500ms, which a dashboard can afford.
    suspend_timeout_seconds = 0
  }
}

# The connection URIs are an EPHEMERAL resource, not attributes of the project:
# provider v0.19.0-beta.0 removed connection_uri, connection_uri_pooler and
# database_password from neon_project outright.
#
# An ephemeral value may only be passed to provider configuration, another
# ephemeral resource, or a WRITE-ONLY argument. That single rule is why the two
# parameters below use value_wo, why there is no output carrying the URL (an
# output would fail with "Ephemeral value not allowed"), and why the Lambda has
# to read its copy back through the data source at the bottom of this file.
ephemeral "neon_connection_uri" "main" {
  count = local.neon_enabled ? 1 : 0

  project_id  = neon_project.main[0].id
  branch_id   = neon_project.main[0].branch.id
  endpoint_id = neon_project.main[0].primary_compute.id
  database    = neon_project.main[0].database_name
  role        = neon_project.main[0].database_user
}

# Two URIs, on purpose:
#
#   pooled (pgbouncer)  the Lambda. Many short-lived invocations, and
#                       src/db/index.ts already sets `prepare: false`, which is
#                       exactly what a pgbouncer connection requires.
#   direct              drizzle-kit. DDL belongs on a session connection, not a
#                       pooled one, so migrations get the unpooled host.
#
# Both are SecureString and both are SEPARATE from aws_ssm_parameter.deploy_targets
# in outputs.tf -- that one is a Standard-tier String and its own comment forbids
# putting a secret in it.
resource "aws_ssm_parameter" "database_url" {
  count = local.neon_enabled ? 1 : 0

  name        = "/${local.name}/database-url"
  description = "Pooled Neon URI. Goes on the server Lambda as DATABASE_URL."
  type        = "SecureString"

  # value_wo keeps the URI out of this resource's state and out of plan output.
  # Bump value_wo_version to rotate the credential; no code change is needed.
  value_wo         = ephemeral.neon_connection_uri.main[0].uri_pooler
  value_wo_version = 1
}

resource "aws_ssm_parameter" "database_url_direct" {
  count = local.neon_enabled ? 1 : 0

  name        = "/${local.name}/database-url-direct"
  description = "Unpooled Neon URI. Read by deploy.yml for `npm run db:migrate`."
  type        = "SecureString"

  value_wo         = ephemeral.neon_connection_uri.main[0].uri
  value_wo_version = 1
}

# Read straight back out, because aws_lambda_function's `environment` block is not
# a write-only argument and therefore cannot take the ephemeral value directly.
#
# depends_on rather than relying on the .name reference alone: the name never
# changes, so on a credential rotation (value_wo_version bumped) a name-only
# dependency would let this read happen BEFORE the parameter was updated, and the
# Lambda would be handed the previous URI.
data "aws_ssm_parameter" "database_url" {
  count = local.neon_enabled ? 1 : 0

  name       = aws_ssm_parameter.database_url[0].name
  depends_on = [aws_ssm_parameter.database_url]
}
