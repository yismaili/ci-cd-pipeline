import { Controller, Post, Body, Res, NotFoundException, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UserInfoDto } from './DTO/UserInfoDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt-auth/jwt.strategy';
import { User } from 'src/entity/user.entity';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 @UseGuards(JwtAuthGuard, JwtStrategy)
  @Get('profile')
  async getUserProfile(@Req() request: any, @Res({ passthrough: true }) response: Response) {
    try {
      const user = request.user;
      
      const filteredUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };
      return filteredUser;
    } catch (error) {
      throw new NotFoundException('User not authorized');
    }
  }

  @Post('signin')
  async signUp(@Body() createUserDto: UserInfoDto, @Res({ passthrough: true}) response: Response): Promise<any> {
    try {
      const { user, token } = await this.usersService.createUser(createUserDto);

      // response.cookie('authorization', token, {
      //   httpOnly: true,
      //   maxAge: 3600 * 1000,
      //   sameSite: 'lax'
      // });

      response.cookie('authorization', token);
      return user
    } catch (error) {
      throw new NotFoundException('Failed to create user');
    }
  }
}

