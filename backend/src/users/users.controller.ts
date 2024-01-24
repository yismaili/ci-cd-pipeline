import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInfoDto } from './DTO/UserInfoDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: UserInfoDto) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      return { message: 'User created successfully', user };
    } catch (error) {
      throw new NotFoundException('Failed to create user');
    }
  }

  @Post('signin')
  async signIn(@Body('email') email: string, @Body('password') password: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Validate password here if needed

      return { message: 'User signed in successfully', user };
    } catch (error) {
      throw new NotFoundException('Failed to sign in user');
    }
  }
}
