import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/user')
  getUser() {
   throw new NotFoundException(); 
    return {
      email: 'test@gmail.com',
      lastname: 'test',
      firstname: 'test',
    };
  }
}
