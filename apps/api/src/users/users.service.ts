import { UsersPrismaService } from '@/database/users.prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userPrisma: UsersPrismaService) {}

  async get(id: string) {
    return await this.userPrisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userPrisma.user.update({
      where: { id: id },
      data: {
        first_name: updateUserDto.first_name ?? '',
        last_name: updateUserDto.last_name ?? '',
      },
    });
  }
}
