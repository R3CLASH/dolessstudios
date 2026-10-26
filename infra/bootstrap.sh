#!/usr/bin/env bash
# One-time setup before the first deploy, run locally with admin credentials:
#
#   AWS_PROFILE=thavisha infra/bootstrap.sh
#
# Creates the Terraform state bucket and doless-gha-deploy, the role that
# .github/workflows/deploy.yml assumes through the account's existing GitHub OIDC provider.
# Safe to re-run.
set -euo pipefail

REPO="R3CLASH/dolessstudios"
# GitHub puts owner and repo IDs in this repo's OIDC subject ("repo:R3CLASH@<id>/dolessstudios@<id>:…").
# The IDs pin the trust to this exact repo even if a name is later freed and reused.
REPO_WITH_IDS="R3CLASH@90696020/dolessstudios@1433989933"
REGION="us-east-1"
ROLE="doless-gha-deploy"
ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"
BUCKET="doless-tfstate-${ACCOUNT}"

# ── State bucket ─────────────────────────────────────────────────────────────
if ! aws s3api head-bucket --bucket "$BUCKET" >/dev/null 2>&1; then
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" >/dev/null
fi
aws s3api put-bucket-versioning --bucket "$BUCKET" --versioning-configuration Status=Enabled
aws s3api put-public-access-block --bucket "$BUCKET" --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# ── Deploy role ──────────────────────────────────────────────────────────────
# Only the main branch, or jobs in the "production" environment, of this repo may assume it.
TRUST=$(cat <<JSON
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::${ACCOUNT}:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": [
          "repo:${REPO_WITH_IDS}:ref:refs/heads/main",
          "repo:${REPO_WITH_IDS}:environment:production"
        ]
      }
    }
  }]
}
JSON
)

# PowerUserAccess covers everything but IAM; IAM is limited to roles under /doless/,
# which excludes this role itself.
IAM_POLICY=$(cat <<JSON
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "iam:CreateRole", "iam:DeleteRole", "iam:GetRole", "iam:UpdateRole",
      "iam:UpdateAssumeRolePolicy", "iam:TagRole", "iam:UntagRole", "iam:ListRoleTags",
      "iam:PutRolePolicy", "iam:GetRolePolicy", "iam:DeleteRolePolicy", "iam:ListRolePolicies",
      "iam:ListAttachedRolePolicies", "iam:ListInstanceProfilesForRole", "iam:PassRole"
    ],
    "Resource": "arn:aws:iam::${ACCOUNT}:role/doless/*"
  }]
}
JSON
)

if aws iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  aws iam update-assume-role-policy --role-name "$ROLE" --policy-document "$TRUST"
else
  aws iam create-role --role-name "$ROLE" --assume-role-policy-document "$TRUST" \
    --description "GitHub Actions deploys of ${REPO}" --max-session-duration 3600 >/dev/null
fi
aws iam attach-role-policy --role-name "$ROLE" --policy-arn arn:aws:iam::aws:policy/PowerUserAccess
aws iam put-role-policy --role-name "$ROLE" --policy-name doless-iam --policy-document "$IAM_POLICY"

echo "State bucket: ${BUCKET}"
echo "Deploy role:  arn:aws:iam::${ACCOUNT}:role/${ROLE}"
