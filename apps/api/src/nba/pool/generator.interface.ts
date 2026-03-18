import { PoolEntry } from '@dribblio/types';

export interface PoolGenerator {
  generate(): Promise<PoolEntry[]>;
}
