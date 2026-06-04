terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ─── IAM User ─────────────────────────────────────────────────────────────────

resource "aws_iam_user" "upload_user" {
  name = var.iam_username
  path = "/cloud-service-hub/"

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "cloud-service-hub"
  }
}

# ─── IAM Login Profile (Console Access) ───────────────────────────────────────

resource "aws_iam_user_login_profile" "upload_user_login" {
  user                    = aws_iam_user.upload_user.name
  password_reset_required = false
}

# ─── IAM Policy ───────────────────────────────────────────────────────────────

resource "aws_iam_policy" "s3_upload_access" {
  name        = "${var.iam_username}-s3-access"
  description = "Grants limited S3 access to ${var.bucket_name} for ${var.project_name} (${var.environment})"
  path        = "/cloud-service-hub/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowListAllBuckets"
        Effect = "Allow"
        Action = [
          "s3:ListAllMyBuckets"
        ]
        Resource = "*"
      },
      {
        Sid    = "AllowListBucket"
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = "arn:aws:s3:::${var.bucket_name}"
      },
      {
        Sid    = "AllowObjectAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "arn:aws:s3:::${var.bucket_name}/*"
      }
    ]
  })

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "cloud-service-hub"
  }
}

# ─── Policy Attachment ─────────────────────────────────────────────────────────

resource "aws_iam_user_policy_attachment" "attach_s3_policy" {
  user       = aws_iam_user.upload_user.name
  policy_arn = aws_iam_policy.s3_upload_access.arn
}
