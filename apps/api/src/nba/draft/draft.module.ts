import { Module } from '@nestjs/common';
import { DraftService } from './draft.service';
import { DraftGateway } from './draft.gateway';

@Module({
  providers: [DraftService, DraftGateway]
})
export class DraftModule {}
