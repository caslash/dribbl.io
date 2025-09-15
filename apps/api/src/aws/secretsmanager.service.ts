import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretsManagerService {
  private client: SecretsManagerClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new SecretsManagerClient({
      region: 'us-east-2',
      endpoint: this.configService.get<string>('AWS_SECRETS_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
      },
    });
  }

  async getSecretValue(secretName: string): Promise<string> {
    let response;

    try {
      response = await this.client.send(new GetSecretValueCommand({ SecretId: secretName }));
    } catch (error) {
      console.error(error);
      throw error;
    }

    if ('SecretString' in response) {
      return response.SecretString;
    }

    throw new Error('Failed to get CloudFront private key');
  }
}
