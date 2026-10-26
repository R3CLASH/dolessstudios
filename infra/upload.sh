#!/usr/bin/env bash
# Uploads OpenNext's build output to the site bucket (layout in cdn.tf). Run from the repo root:
#
#   infra/upload.sh <bucket>
#
# Nothing is deleted: pages still cached at the edge, or open in a browser, keep loading their old chunks.
set -euo pipefail

BUCKET="$1"

aws s3 sync .open-next/assets/_next "s3://${BUCKET}/_assets/_next" --only-show-errors \
  --cache-control "public, max-age=31536000, immutable"
# public/ files keep their names across deploys: browsers revalidate, CloudFront holds them until the next invalidation.
aws s3 sync .open-next/assets "s3://${BUCKET}/_assets" --only-show-errors --exclude "_next/*" \
  --cache-control "public, max-age=0, s-maxage=31536000, must-revalidate"
aws s3 sync .open-next/cache "s3://${BUCKET}/_cache" --only-show-errors
