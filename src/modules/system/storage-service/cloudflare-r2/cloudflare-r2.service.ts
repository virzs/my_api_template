import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudflareR2Service {
  private s3Client: S3Client | null = null;

  constructor(private readonly configService: ConfigService) {}

  private async getConfig() {
    return await this.configService.get('r2');
  }

  private async initializeS3Client() {
    const config = await this.getConfig();

    this.s3Client = new S3Client({
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
    });
  }

  private async getS3Client() {
    if (!this.s3Client) {
      await this.initializeS3Client();
    }
    return this.s3Client;
  }

  async uploadFile(key: string, file: Express.Multer.File) {
    const s3Client = await this.getS3Client();
    const config = await this.getConfig();

    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return s3Client.send(command);
  }

  async getFileUrl(key: string) {
    const s3Client = await this.getS3Client();
    const config = await this.getConfig();

    const command = new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // 使用自定义域名替换默认的 Cloudflare R2 域名
    const customDomain = config.customDomain;
    if (customDomain) {
      console.log(
        '🚀 ~ CloudflareR2Service ~ getFileUrl ~ url:',
        url.replace(
          `${config.bucket}.${config.accountId}.r2.cloudflarestorage.com`,
          customDomain,
        ),
      );
      return url.replace(
        `${config.bucket}.${config.accountId}.r2.cloudflarestorage.com`,
        customDomain,
      );
    }

    return url;
  }

  async deleteFile(key: string) {
    const s3Client = await this.getS3Client();
    const config = await this.getConfig();

    const command = new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    });

    return s3Client.send(command);
  }
}
