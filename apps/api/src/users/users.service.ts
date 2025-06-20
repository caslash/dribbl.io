import { UsersPrismaService } from '@/database/users.prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userPrisma: UsersPrismaService) {}

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
        profile_url: updateUserDto.profile_url ?? '',
      },
    });
  }
}
