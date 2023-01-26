import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDTO } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDTO) {
    const newUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete newUser.password;

    return newUser;
  }
}
