import { CloudFrontService } from '@/aws/cloudfront.service';
import { S3Service } from '@/aws/s3.service';
import { SecretsManagerService } from '@/aws/secretsmanager.service';
import { S3Client } from '@aws-sdk/client-s3';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    S3Service,
    CloudFrontService,
    SecretsManagerService,
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          endpoint: configService.get<string>('AWS_S3_ENDPOINT'),
          forcePathStyle: true,
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3Service, CloudFrontService],
})
@Global()
export class AWSModule {}
