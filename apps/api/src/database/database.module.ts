import { PrismaService } from '@/database/prisma.service';
import { Global, Module } from '@nestjs/common';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
@Global()
export class DatabaseModule {}
