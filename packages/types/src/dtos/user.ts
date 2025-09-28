import { users } from '@dribblio/database';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  display_name?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export type UserGameInfo = {
  info: users.users;
  score: number;
};
