import { users } from '@dribblio/database';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class UsersPrismaService extends users.PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
