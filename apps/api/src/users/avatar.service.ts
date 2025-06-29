import { S3Service } from '@/users/s3.service';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarService {
  private readonly urlExpirySeconds = 15 * 60;

  constructor(private readonly s3Service: S3Service) {}

  private async getCloudFrontPrivateKey() {
    const secret_name = process.env.AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME;

    const client = new SecretsManagerClient({ region: 'us-east-2' });

    let response;

    try {
      response = await client.send(new GetSecretValueCommand({ SecretId: secret_name }));
    } catch (error) {
      console.error(error);
      throw error;
    }

    if ('SecretString' in response) {
      return response.SecretString;
    }

    throw new Error('Failed to get CloudFront private key');
  }

  // TODO: Move signed url logic to controller with a interceptor
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const now = new Date().toISOString();
    await this.s3Service.uploadFile(`${userId}-${now}`, file.buffer);

    const encodedUserId = encodeURIComponent(userId);
    const encodedDate = encodeURIComponent(now);

    const unsignedUrl = `https://${process.env.AWS_CLOUDFRONT_CNAME}/${encodedUserId}-${encodedDate}.jpg`;

    return unsignedUrl;
  }

  async getSignedUrl(unsignedUrl: string) {
    const nowMs = Date.now();
    const expiryDate = new Date(nowMs + this.urlExpirySeconds * 1000);

    const privateKey = await this.getCloudFrontPrivateKey();

    const signedUrl = getSignedUrl({
      url: unsignedUrl,
      keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID ?? '',
      dateLessThan: expiryDate,
      privateKey,
    });

    return signedUrl;
  }
}
