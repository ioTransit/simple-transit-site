import fs from 'fs'
import sqlite3 from 'sqlite3'
import cron from 'node-cron';
import { envConfig } from '~/config.server';
import { S3Client, CopyObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import path from 'path';

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

const vacuumDb = (dbPath: string, backupPath: string) => {
  // Open the SQLite database
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Error opening the database:', err.message);
      return;
    }

    // Perform VACUUM operation
    db.exec(`ATTACH DATABASE '${backupPath}' AS backup;`, (attachErr) => {
      if (attachErr) {
        console.error('Error attaching backup database:', attachErr.message);
        db.close();
        return;
      }

      db.exec('VACUUM INTO backup.main;', (vacuumErr) => {
        if (vacuumErr) {
          console.error('Error performing VACUUM:', vacuumErr.message);
        } else {
          console.log('VACUUM operation successful.');

          // If needed, you can also copy the backup to another location
          fs.copyFileSync(`${backupPath}.main`, `${backupPath}`);

          console.log('Backup saved to:', backupPath);
        }

        // Detach the backup database
        db.exec('DETACH DATABASE backup;', (detachErr) => {
          if (detachErr) {
            console.error('Error detaching backup database:', detachErr.message);
          }

          // Close the main database
          db.close((closeErr) => {
            if (closeErr) {
              console.error('Error closing the database:', closeErr.message);
            }
          });
        });
      });
    });
  });
}

async function uploadFilesToS3(directory: string, prefix: string) {
  // Read the contents of the local directory
  const files = fs.readdirSync(directory);

  // Upload each file to S3
  for (const file of files) {
    const filePath = path.join(directory, file);

    // Skip directories
    if (fs.statSync(filePath).isDirectory()) {
      continue;
    }

    // Read the file content
    const fileContent = fs.readFileSync(filePath);

    // Create S3 PutObjectCommand with the specified prefix
    const uploadParams = {
      Bucket: envConfig.S3_BUCKET,
      Key: `${prefix}/${file}`, // Include the prefix in the S3 key
      Body: fileContent,
    };

    // Upload the file to S3
    try {
      const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams));
      console.log(`File uploaded successfully: ${file} - ETag: ${uploadResult.ETag}`);
    } catch (error) {
      console.error(`Error uploading file ${file} to S3:`, error);
    }
  }
}

cron.schedule('* * * * *', () => {
  vacuumDb('/drizzle/data.db', 'drizzle/backup')
  uploadFilesToS3('drizzle/data.db', '/db-backup/data.db')
}) 
