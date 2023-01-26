import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token,
    };
  }

  async login({
    email,
    password,
  }: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, email);
  }

  async register(dto: RegisterDTO) {
    try {
      if (dto.password !== dto.repeatPassword) {
        throw new BadRequestException('Passwords must be equal!');
      }
      const password = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password,
        },
      });

      return this.signToken(user.id, dto.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email or name has already been used!');
        }
      }
      throw error;
    }
  }
}
