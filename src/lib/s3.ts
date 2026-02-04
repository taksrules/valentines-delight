import { S3Client } from '@aws-sdk/client-s3';

const projectRef = 'vbszttesustjohrftklf';

export const s3Client = new S3Client({
  region: 'eu-west-1',
  endpoint: `https://${projectRef}.supabase.co/storage/v1/s3`,
  credentials: {
    accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_ACCESS_KEY_SECRET!,
  },
  forcePathStyle: true,
  // Using a more robust request handler configuration
  // to avoid SSL issues in some environments
  maxAttempts: 3,
});

export const JOURNEY_PHOTOS_BUCKET = 'journey-photos';
