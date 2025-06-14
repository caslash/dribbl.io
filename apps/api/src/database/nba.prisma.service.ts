import { nba } from '@dribblio/database';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class NBAPrismaService extends nba.PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
