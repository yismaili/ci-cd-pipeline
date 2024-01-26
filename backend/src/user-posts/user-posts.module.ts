import { Module } from '@nestjs/common';
import { UserPostsGateway } from './user-posts.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/user-post.entity';
import { User } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UserPostsService } from './user-posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    UsersModule
  ],
  providers: [
    UserPostsGateway,
    UserPostsService,
  ],
})
export class UserPostsModule {}
