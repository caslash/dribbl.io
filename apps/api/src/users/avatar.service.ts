import { S3Service } from '@/aws/s3.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
    const now = new Date().toISOString();
    await this.s3Service.uploadFile(`${userId}-${now}`, file.buffer);

    const encodedUserId = encodeURIComponent(userId);
    const encodedDate = encodeURIComponent(now);

    const unsignedUrl = `https://${process.env.AWS_CLOUDFRONT_CNAME}/${encodedUserId}-${encodedDate}.jpg`;

    return unsignedUrl;
  }
}
