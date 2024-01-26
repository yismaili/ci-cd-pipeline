import { Body, Controller, NotFoundException, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserLoginDto } from './DTO/UserLoginDto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto, @Res({ passthrough: true}) response: Response) {
    try {
      const { user, token } = await this.authService.login(userLoginDto);
      response.cookie('authorization', token, {
        maxAge: 3600 * 1000
      });
      return user
    } catch (error) {
      throw new NotFoundException('Failed to create user');
    }
  }
}

