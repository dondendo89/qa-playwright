import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { validateEnv } from '@qa-playwright/shared';
import { logger } from './logger';

const env = validateEnv();

// Crea il client S3
const s3Client = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

/**
 * Carica un artifact su S3 e restituisce l'URL
 */
export async function uploadArtifact({
  buffer,
  filename,
  contentType = 'application/octet-stream',
}: {
  buffer: Buffer;
  filename: string;
  contentType?: string;
}): Promise<string> {
  try {
    const key = `artifacts/${filename}`;
    
    // Carica il file su S3
    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    
    await s3Client.send(command);
    
    // Genera un URL firmato per l'accesso
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 * 7 }); // 7 giorni
    
    logger.info({ key, size: buffer.length }, 'Artifact uploaded successfully');
    
    return url;
  } catch (error) {
    logger.error({ error, filename }, 'Failed to upload artifact');
    throw new Error(`Failed to upload artifact: ${error.message}`);
  }
}