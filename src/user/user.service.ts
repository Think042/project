import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { Hash } from 'src/common/Hash';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getUserByEmail(email) {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    return user;
  }
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
  async create(body) {
    const checkEmail = await this.getUserByEmail(body.email);
    if (checkEmail) {
      return false;
    }
    const user = body;
    user.password = Hash.make(body.password);
    await this.prisma.user.create({ data: user });

    return true;
  }
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async DeleteUser(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: id },
      data: { isDeleted: true },
    });
  }
}
