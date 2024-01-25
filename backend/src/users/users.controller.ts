import { Controller, Post, Body, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UserInfoDto } from './DTO/UserInfoDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async sayhi(@Body() createUserDto: UserInfoDto, @Res() response: Response) {
    console.log(createUserDto)
    try {
      const { user, token } = await this.usersService.createUser(createUserDto);
      response.cookie('jwt', token, { httpOnly: true });

      return { message: 'User created successfully', user };
    } catch (error) {
      throw new NotFoundException('Failed to create user');
    }
  }
  @Post('signup')
  async signUp(@Body() createUserDto: UserInfoDto, @Res() response: Response) {
    console.log(createUserDto)
    try {
      const { user, token } = await this.usersService.createUser(createUserDto);
      response.cookie('jwt', token, { httpOnly: true });

      return { message: 'User created successfully', user };
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

