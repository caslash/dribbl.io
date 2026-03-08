import { DraftRoomConfig, PoolEntry } from '@dribblio/types';

export interface PoolGenerator {
  generate(config: DraftRoomConfig): Promise<PoolEntry[]>;
}
