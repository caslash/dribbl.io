import { SignedUrlInterceptor } from '@/users/signedurl.inteceptor';
import { UsersService } from '@/users/users.service';
import { UpdateUserDto } from '@dribblio/types';
import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SignedUrlInterceptor)
@Controller('me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get(@Request() req) {
    return await this.usersService.get(req.user.id);
  }

  @Patch()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(req.user.id, updateUserDto);
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadProfileImage(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return await this.usersService.uploadProfileImage(req.user.id, file);
  }
}
