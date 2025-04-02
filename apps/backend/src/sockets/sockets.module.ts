import { CareerPathModule } from '@/sockets/careerpath/careerpath.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CareerPathModule],
  controllers: [],
  providers: [],
})
export class SocketsModule {}
