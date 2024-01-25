import { Controller, Post, Body, Res, NotFoundException, Get, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UserInfoDto } from './DTO/UserInfoDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  response: any;
  @Get('profile')
  googlelogin(@Res() res: Response,) {
    return res.status(HttpStatus.OK).json(this.response);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: UserInfoDto, @Res({ passthrough: true}) response: Response): Promise<any> {
    try {
      const { user, token } = await this.usersService.createUser(createUserDto);

      response.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600 * 1000
      });
      
      // return response.send("hi");
    } catch (error) {
      throw new NotFoundException('Failed to create user');
    }
  }

  @Post('signin')
  async signIn(@Body('email') email: string, @Body('password') password: string, @Res() response: Response) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const token = this.usersService.generateToken(user);

      response.cookie('jwt', token, { httpOnly: true });

      return { message: 'User signed in successfully', user };
    } catch (error) {
      throw new NotFoundException('Failed to sign in user');
    }
  }
}

