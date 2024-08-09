import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
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

  @Delete('user/:id')
  async DeleteUser(@Param('id') id: number): Promise<UserModel> {
    return this.userService.DeleteUser(id);
  }
}
