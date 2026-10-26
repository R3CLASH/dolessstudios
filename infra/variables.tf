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
  description = "Optional Postgres URL for briefs and newsletter sign-ups. Without it the newsletter says it's offline."
  type        = string
  default     = ""
  sensitive   = true
}
