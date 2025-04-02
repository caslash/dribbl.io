import { ApiModule } from '@/api/api.module';
import { SocketsModule } from '@/sockets/sockets.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ApiModule, SocketsModule],
})
export class AppModule {}
