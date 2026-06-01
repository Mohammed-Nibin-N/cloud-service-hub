output "iam_username" {
  description = "The IAM username created for S3 upload access"
  value       = aws_iam_user.upload_user.name
}

output "temporary_password" {
  description = "Temporary password for IAM console login (must be changed at first login)"
  value       = aws_iam_user_login_profile.upload_user_login.password
  sensitive   = true
}

output "aws_console_signin_url" {
  description = "AWS Console sign-in URL for IAM users"
  value       = "https://${var.aws_account_id}.signin.aws.amazon.com/console"
}

output "aws_console_url" {
  description = "AWS Console URL for the S3 bucket"
  value       = "https://console.aws.amazon.com/s3/buckets/${var.bucket_name}?region=${var.aws_region}"
}

output "bucket_name" {
  description = "The S3 bucket that access was granted to"
  value       = var.bucket_name
}

output "policy_arn" {
  description = "ARN of the IAM policy attached to the user"
  value       = aws_iam_policy.s3_upload_access.arn
}
