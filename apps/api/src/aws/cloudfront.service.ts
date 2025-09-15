import { SecretsManagerService } from '@/aws/secretsmanager.service';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudFrontService {
  private readonly urlExpirySeconds = 15 * 60;

  constructor(
    private readonly configService: ConfigService,
    private readonly secretsManagerService: SecretsManagerService,
  ) {}

  async generateSignedURL(unsignedUrl: string): Promise<string> {
    const nowMs = Date.now();
    const expiryDate = new Date(nowMs + this.urlExpirySeconds * 1000);

    const secretName = this.configService.get<string>('AWS_CLOUDFRONT_PRIVATE_KEY_SECRET_NAME');

    if (secretName) {
      const privateKey = await this.secretsManagerService.getSecretValue(secretName);

      const signedUrl = getSignedUrl({
        url: unsignedUrl,
        keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID ?? '',
        dateLessThan: expiryDate,
        privateKey,
      });

      return signedUrl;
    } else {
      throw Error('Secret name could not be found');
    }
  }
}
