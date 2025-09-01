import { AvatarService } from '@/users/avatar.service';
import { S3Service } from '@/users/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    S3Service,
    AvatarService,
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
  exports: [UsersService],
})
export class UsersModule {}
