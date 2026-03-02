import { PoolEntry, RoomConfig } from '@dribblio/types';

export interface PoolGenerator {
  generate(config: RoomConfig): Promise<PoolEntry[]>;
}
