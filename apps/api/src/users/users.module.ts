import { AWSModule } from '@/aws/aws.module';
import { AvatarService } from '@/users/avatar.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AWSModule],
  controllers: [UsersController],
  providers: [UsersService, AvatarService],
  exports: [UsersService],
})
export class UsersModule {}
