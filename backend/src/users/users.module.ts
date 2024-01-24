import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ JwtModule.register({
    secret: 'secret',
    signOptions: { expiresIn: '1h' },
  }),],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
