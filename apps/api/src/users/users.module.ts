import { S3Service } from '@/users/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    S3Service,
    {
      provide: S3Client,
      useValue: new S3Client(),
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
