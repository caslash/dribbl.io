import { NBAPrismaService } from '@/database/nba.prisma.service';
import { UsersPrismaService } from '@/database/users.prisma.service';
import { Global, Module } from '@nestjs/common';

@Module({
  providers: [UsersPrismaService, NBAPrismaService],
  exports: [UsersPrismaService, NBAPrismaService],
})
@Global()
export class DatabaseModule {}
