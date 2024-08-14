import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private httpService: HttpService,
  ) {}

  @Post('login')
  @ApiResponse({ status: 201, description: 'LOGIN_SUCCESS' })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  async login(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const user = await this.authService.validateUser(request.body);
    const userStatusDeleted = (
      await this.userService.getUserByEmail(user.user.email)
    ).isDeleted;
    if (user.userExist == true && userStatusDeleted == false) {
      const token = await this.authService.createToken(user.user);
      return response.status(200).json({
        data: token,
        message: 'LOGIN_SUCCESS',
        statusCode: 200,
        success: 1,
      });
    } else {
      return response.status(400).json({
        data: null,
        message: 'LOGIN_FAILED',
        statusCode: 400,
        success: 0,
      });
    }
  }
  //@ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  @ApiResponse({ status: 200, description: 'RESPONSE_SUCCESS' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  async getLoggedInUser(@Req() req, @Res() response: Response): Promise<any> {
    const id = req.user.id;
    const user = await this.userService.getUserById(id);
    if (user != undefined) {
      return response.status(200).json({
        data: user,
        message: 'PROFILE_SUCCESS',
        statusCode: 200,
        success: 1,
      });
    } else
      return response.status(401).json({
        data: null,
        message: 'UNAUTHORIZED',
        statusCode: 401,
        success: 0,
      });
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'REGISTER_SUCCESS' })
  @ApiResponse({ status: 400, description: 'BAD_REQUEST' })
  @ApiResponse({ status: 401, description: 'UNAUTHORIZED' })
  async register(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const success = await this.userService.create(request.body);
    if (success) {
      const token = await this.authService.createToken(request.body);
      return response.status(200).json({
        data: token,
        message: 'REGISTER_SUCCESSFUL',
        statusCode: 200,
        success: 1,
      });
    } else {
      return response.status(201).json({
        data: null,
        message: 'Email already registered',
        statusCode: 201,
        success: 0,
      });
    }
  }
}
