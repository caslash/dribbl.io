import { UsersPrismaService } from '@/database/users.prisma.service';
import { AvatarService } from '@/users/avatar.service';
import { S3Service } from '@/users/s3.service';
import { UpdateUserDto } from '@dribblio/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly userPrisma: UsersPrismaService,
    private readonly s3Service: S3Service,
    private readonly avatarService: AvatarService,
  ) {}

  async get(id: string) {
    const user = await this.userPrisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userPrisma.user.update({
      where: { id: id },
      data: {
        display_name: updateUserDto.display_name ?? '',
        name: updateUserDto.name ?? '',
      },
    });
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const profile_url = await this.avatarService.uploadAvatar(userId, file);

    return await this.userPrisma.user.update({
      where: { id: userId },
      data: { profile_url },
    });
  }
}
