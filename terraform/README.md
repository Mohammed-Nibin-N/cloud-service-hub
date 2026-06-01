# Cloud Service Hub — Terraform Infrastructure

This Terraform configuration provisions an S3 bucket with secure defaults and an IAM user with least-privilege access scoped to that bucket.

## Resources Created

| Resource | Description |
|----------|-------------|
| `aws_s3_bucket` | S3 bucket for file uploads |
| `aws_s3_bucket_versioning` | Enables object versioning |
| `aws_s3_bucket_server_side_encryption_configuration` | AES-256 server-side encryption |
| `aws_s3_bucket_public_access_block` | Blocks all public access |
| `aws_iam_user` | IAM user for S3 upload access |
| `aws_iam_policy` | Policy granting limited S3 permissions |
| `aws_iam_user_policy_attachment` | Attaches the policy to the user |

## Security Controls

- **No public access** — All public access is blocked at the bucket level
- **Encryption at rest** — AES-256 server-side encryption enabled by default
- **Versioning** — Object versioning enabled for data protection
- **Least-privilege IAM** — Only `ListBucket`, `GetObject`, and `PutObject` are allowed
- **Scoped access** — IAM policy references the specific bucket ARN only (no wildcards)
- **Organized IAM** — Users and policies created under `/cloud-service-hub/` path

## Variables

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `project_name` | Name of the project requesting access | Yes | — |
| `environment` | Target environment (DEV, QA, PROD) | Yes | — |
| `bucket_name` | S3 bucket name to create | Yes | — |
| `iam_username` | IAM username to create | Yes | — |
| `aws_region` | AWS region | No | us-east-1 |

## Usage

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Create your variables file

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 3. Preview changes

```bash
terraform plan
```

Review the plan output to confirm the resources that will be created.

### 4. Apply changes

```bash
terraform apply
```

Type `yes` when prompted to create the resources.

### 5. View outputs

```bash
terraform output
```

## Outputs

| Name | Description |
|------|-------------|
| `iam_username` | The IAM username that was created |
| `aws_console_url` | Direct link to the S3 bucket in AWS Console |
| `bucket_name` | The S3 bucket name |
| `s3_bucket_name` | The S3 bucket name (alias) |
| `s3_bucket_arn` | The full ARN of the S3 bucket |
| `policy_arn` | ARN of the attached IAM policy |

## Prerequisites

- Terraform >= 1.5.0
- AWS CLI configured with appropriate credentials
- Permissions to create S3 buckets, IAM users, and IAM policies in the target AWS account
