import { CloudFrontClient } from "@aws-sdk/client-cloudfront";

const cloudFront = new CloudFrontClient({
  region: process.env.BUCKET_NAME,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export default cloudFront;
