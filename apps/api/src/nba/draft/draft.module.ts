import { PoolModule } from '@/nba/pool/pool.module';
import { Module } from '@nestjs/common';
import { DraftGateway } from './draft.gateway';
import { DraftService } from './draft.service';

@Module({
  imports: [PoolModule],
  providers: [DraftService, DraftGateway],
})
export class DraftModule {}
