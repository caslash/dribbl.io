import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT ?? 3002);
}
dotenv.config();
bootstrap();
