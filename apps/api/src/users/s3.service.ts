import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  constructor(private readonly s3: S3Client) {}

  async uploadFile(userId: string, file: Buffer) {
    console.log(file);
    try {
      const parallelUploads3 = new Upload({
        client: this.s3,
        params: { Bucket: 'dribblio', Key: userId, Body: file },
      });

      await parallelUploads3.done();
    } catch (e) {
      console.log(e);
    }
  }
}
