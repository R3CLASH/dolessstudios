import type { OpenNextConfig } from "@opennextjs/aws/types/open-next.js";

// Builds .open-next/ for infra/: the server and image functions sit behind API Gateway (HTTP API, buffered responses),
// prerendered pages are read from S3, and there's no ISR or revalidateTag, so no tag cache or revalidation queue.
const config = {
  default: {
    override: {
      wrapper: "aws-lambda",
      converter: "aws-apigw-v2",
      incrementalCache: "s3-lite",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  imageOptimization: {
    loader: "s3-lite",
  },
  dangerous: {
    disableTagCache: true,
  },
} satisfies OpenNextConfig;

export default config;
