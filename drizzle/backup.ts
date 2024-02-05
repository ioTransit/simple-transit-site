
import cron from 'node-cron';
import { envConfig } from '~/config.server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
const s3Client = new S3Client({
  region: "us-east-1", // Replace with your AWS region
  credentials: {
    accessKeyId: envConfig.AWS_ACCESS_KEY_ID, // Replace with your AWS access key ID
    secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY
  },
});

// Function to perform S3 object copy (backup)
export async function backupS3Object(bucket: string, filePath: string, destinationKey: string) {
  try {
    const fileContent = fs.readFileSync(filePath);

    // Create S3 PutObjectCommand with the specified prefix
    const copyObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: destinationKey,
      Body: fileContent,
    });

    const response = await s3Client.send(copyObjectCommand);
    console.log(`Backup successful. Copy operation response:`, response);
  } catch (error) {
    console.error("Error backing up S3 object:", error);
  }
}

cron.schedule('* * * * *', () => {
  backupS3Object(envConfig.S3_BUCKET, './drizzle/data.db', 'data.db')
}) 
