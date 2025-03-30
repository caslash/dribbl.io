import { AwardsController } from '@/api/awards/api.awards.controller';
import { AwardsService } from '@/api/awards/api.awards.service';
import { DatabaseModule } from '@/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [AwardsController],
  providers: [AwardsService],
})
export class AwardsApiModule {}
