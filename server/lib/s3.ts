// server/lib/s3.ts
import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  region: process.env.S3_REGION!,   // us-east-2
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})
