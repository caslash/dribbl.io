import { GameMachine } from '@/server/lib/models/gamemachine';

export interface Room {
  id: string;
  gameMachine: GameMachine | undefined;
  users: User[];
}

export interface User {
  id: string;
  name: string;
}
