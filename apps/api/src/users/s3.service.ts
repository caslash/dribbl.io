import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  constructor(private readonly s3: S3Client) {}

  async uploadFile(userId: string, file: Buffer) {
    try {
      const parallelUploads3 = new Upload({
        client: this.s3,
        params: {
          Bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
          Key: `avatars/${userId}.jpg`,
          Body: file,
        },
      });

      await parallelUploads3.done();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
