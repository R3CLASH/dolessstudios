variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "domain_name" {
  description = "Custom domain, e.g. dolessstudios.com. Empty serves the site on the CloudFront domain."
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "us-east-1 ACM certificate for domain_name. Required with domain_name."
  type        = string
  default     = ""
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

variable "smtp_user" {
  type    = string
  default = ""
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
}

variable "database_url" {
  description = "Optional Postgres URL for a copy of briefs and newsletter sign-ups. Both are emailed either way."
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

variable "dodo_environment" {
  description = "Which Dodo mode to use. Defaults to test_mode on purpose: the SDK falls back to live_mode when this is unset, and a half-configured production must not be able to charge a real card."
  type        = string
  default     = "test_mode"

  validation {
    condition     = contains(["test_mode", "live_mode"], var.dodo_environment)
    error_message = "dodo_environment must be exactly \"test_mode\" or \"live_mode\"."
  }
}
