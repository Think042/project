import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Hash } from './../common/Hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async createToken(user: User) {
    user.password = undefined;
    return {
      accessToken: this.jwtService.sign({ user: user, role: 'user' }),
      user,
    };
  }

  async validateUser(userBody): Promise<any> {
    const user = await this.userService.getUserByEmail(userBody.email);
    if (!user || !Hash.compare(userBody.password, user.password)) {
      //throw new UnauthorizedException('Invalid credentials!');
      return { user: null, userExist: false };
    }
    return { user: user, userExist: true };
  }
}
