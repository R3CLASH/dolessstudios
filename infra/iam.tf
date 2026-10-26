# Shared by both functions. Under /doless/ so the GitHub Actions role, which may only manage
# roles on that path (see bootstrap.sh), can't touch anything else in IAM.
resource "aws_iam_role" "lambda" {
  name = "${local.name}-lambda"
  path = "/${local.name}/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "lambda" {
  name = "${local.name}-lambda"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = ["${aws_cloudwatch_log_group.server.arn}:*", "${aws_cloudwatch_log_group.image.arn}:*"]
      },
      # The server reads prerendered pages from _cache/ (and may write there); the image optimizer reads
      # source images from _assets/.
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
        Resource = "${aws_s3_bucket.site.arn}/_cache/*"
      },
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = "${aws_s3_bucket.site.arn}/_assets/*"
      },
      # So a missing key is a 404 rather than a 403.
      {
        Effect    = "Allow"
        Action    = ["s3:ListBucket"]
        Resource  = aws_s3_bucket.site.arn
        Condition = { StringLike = { "s3:prefix" = ["_cache/*", "_assets/*"] } }
      },
    ]
  })
}
