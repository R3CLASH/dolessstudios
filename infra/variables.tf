variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "domain_name" {
  description = "Root domain, e.g. dolessstudios.com. Both it and www.<domain> are served. Empty serves the site on the CloudFront domain."
  type        = string
  default     = "dolessstudios.com"
}

variable "canonical_host" {
  description = "Which hostname is canonical and baked into NEXT_PUBLIC_SITE_URL: \"www\" or \"apex\"."
  type        = string
  default     = "www"

  validation {
    condition     = contains(["www", "apex"], var.canonical_host)
    error_message = "canonical_host must be \"www\" or \"apex\"."
  }
}

# A *.<domain> wildcard does NOT cover the apex, so a wildcard-only certificate cannot serve dolessstudios.com.
variable "acm_certificate_arn" {
  description = "us-east-1 ACM certificate covering BOTH the apex and www. Required with domain_name."
  type        = string
  default     = "arn:aws:acm:us-east-1:349631302124:certificate/7440c36e-04f2-4d68-9d66-2bfa418e440d"
}

# Contact form email (src/lib/mail.ts). Without SMTP_USER/SMTP_PASS briefs only reach the database, if there is one.

variable "smtp_host" {
  type    = string
  default = "smtp.gmail.com"
}

variable "smtp_port" {
  type    = string
  default = "465"
}

# sensitive so it stays out of plan output: this repo is public, and so are its Actions logs.
variable "smtp_user" {
  type      = string
  default   = ""
  sensitive = true
}

variable "smtp_pass" {
  description = "For Gmail, an App Password."
  type        = string
  default     = ""
  sensitive   = true
}

variable "contact_to_email" {
  type    = string
  default = "thavishamudunkotuwa1998@gmail.com"
}

variable "contact_from_email" {
  description = "Optional. Defaults to \"Do Less Studios <smtp_user>\"."
  type        = string
  default     = ""
  sensitive   = true
}

# The database itself is provisioned here now -- see infra/database.tf. There is no
# database_url variable any more: Terraform derives the connection URL from the Neon
# project it creates and publishes it to SSM, so this key is the only input.
variable "neon_api_key" {
  description = "Optional Neon API key. Empty provisions no database, leaves DATABASE_URL off the Lambda, and /admin falls back to its no-database state. Create one at console.neon.tech -> Account settings -> API keys."
  type        = string
  default     = ""
  sensitive   = true
}

# /admin (src/app/(admin)/) and the signed buyer order links. Both are request-time
# only — unlike DODO_PAYMENTS_* (trap #13) neither is read at build, so they belong
# on the Lambda and nowhere in deploy.yml.

variable "admin_password" {
  description = "Optional shared password for /admin. Empty makes every admin route 404, including the login form. Generate with: openssl rand -base64 24"
  type        = string
  default     = ""
  sensitive   = true
}

variable "order_link_secret" {
  description = "Optional. Signs the /orders/<ref> links in order confirmation emails. Empty omits the link from the email and 404s the page. Generate with: openssl rand -base64 32"
  type        = string
  default     = ""
  sensitive   = true
}

variable "dodo_api_key" {
  description = "Optional Dodo Payments API key. Empty hides the buy buttons and routes every CTA to the quote form."
  type        = string
  default     = ""
  sensitive   = true
}

variable "dodo_webhook_key" {
  description = "Optional Dodo Payments webhook signing key. Empty makes the webhook answer 503, so Dodo retries rather than losing the event."
  type        = string
  default     = ""
  sensitive   = true
}

variable "dodo_test_product_id" {
  description = "Temporary. One Dodo product id outside the catalog that /checkout will accept, for the Sri Lanka payout test. Not a secret — knowing it only lets someone pay us. Unset it and redeploy once the test is done."
  type        = string
  default     = ""
}

variable "dodo_environment" {
  description = "Which Dodo mode to use. Defaults to test_mode on purpose: the SDK falls back to live_mode when this is unset, and a half-configured production must not be able to charge a real card."
  type        = string
  default     = "test_mode"

  validation {
    condition     = contains(["test_mode", "live_mode"], var.dodo_environment)
    error_message = "dodo_environment must be exactly \"test_mode\" or \"live_mode\"."
  }
}
