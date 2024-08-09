import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get('users')
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.users({
      where: { isDeleted: false },
    });
  }

  @Put('user/:id')
  async DeleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: { isDeleted: true },
    });
  }
}
