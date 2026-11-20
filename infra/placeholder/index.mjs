// Placeholder bundle. Terraform creates the Lambda functions from this so that `apply` never
// needs a build; .github/workflows/deploy.yml then ships the real OpenNext bundle with
// `aws lambda update-function-code`. Seeing this response means code has never been deployed
// (or the function was replaced) — run the Deploy workflow.
export const handler = async () => ({
  statusCode: 503,
  headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  body: "Not deployed yet. Run the Deploy workflow.\n",
});
