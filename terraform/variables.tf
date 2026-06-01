variable "project_name" {
  description = "Name of the project requesting access"
  type        = string
}

variable "environment" {
  description = "Target environment (NONPROD, PROD)"
  type        = string

  validation {
    condition     = contains(["NONPROD", "PROD"], var.environment)
    error_message = "Environment must be one of: NONPROD, PROD."
  }
}

variable "bucket_name" {
  description = "S3 bucket name to grant access to"
  type        = string
}

variable "iam_username" {
  description = "IAM username to create for S3 access"
  type        = string
}

variable "aws_region" {
  description = "AWS region for the provider"
  type        = string
  default     = "us-east-1"
}

variable "aws_account_id" {
  description = "AWS account ID for console sign-in URL"
  type        = string
}
