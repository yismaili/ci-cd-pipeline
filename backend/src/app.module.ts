import { Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserPostsGateway } from './user-posts/user-posts.gateway';
import { UserPostsService } from './user-posts/user-posts.service';
import { Post } from './user-posts/entities/user-post.entity';
import { UserPostsModule } from './user-posts/user-posts.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: 5432,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [User,Post],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    UserPostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
