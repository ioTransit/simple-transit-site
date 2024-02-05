
import cron from 'node-cron';
import { envConfig } from '~/config.server';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: "us-east-1", // Replace with your AWS region
  credentials: {
    accessKeyId: envConfig.AWS_ACCESS_KEY_ID, // Replace with your AWS access key ID
    secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY
  },
});

// Function to perform S3 object copy (backup)
export async function backupS3Object(bucket: string, sourceKey: string, destinationKey: string) {
  try {
    const copyObjectCommand = new CopyObjectCommand({
      Bucket: envConfig.S3_BUCKET, // Replace with your S3 bucket name
      CopySource: `/${bucket}/${sourceKey}`, // Source object key
      Key: destinationKey, // Destination object key
    });
    const response = await s3Client.send(copyObjectCommand);
    console.log(`Backup successful. Copy operation response:`, response);
  } catch (error) {
    console.error("Error backing up S3 object:", error);
  }
}

cron.schedule('* * * * *', () => {
  backupS3Object(envConfig.S3_BUCKET, 'data.db', '/drizzle/data.db')
}) 
