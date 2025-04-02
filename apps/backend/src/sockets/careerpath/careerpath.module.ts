import { MultiplayerGateway } from '@/sockets/careerpath/multiplayer/multiplayer.gateway';
import { SingleplayerGateway } from '@/sockets/careerpath/singleplayer/singleplayer.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [MultiplayerGateway, SingleplayerGateway],
})
export class CareerPathModule {}
