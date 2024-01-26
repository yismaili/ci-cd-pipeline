import { Injectable } from '@nestjs/common';
import { CreateUserPostDto } from './dto/create-user-post.dto';
import { Socket, Server} from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/user-post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';

@Injectable()
export class UserPostsService {
  constructor(
    @InjectRepository(Post)private postRepository: Repository<Post>,
    @InjectRepository(User)private usersRepository: Repository<User>
  ) {}

  isconnected: Map<string, Socket[]> = new Map<string, Socket[]>();

  async create(createUserPostDto: CreateUserPostDto, client, server): Promise<any> {
  
    const user =  await this.usersRepository.findOne({
      where:{
        id: createUserPostDto.userId
      }
    })
    const newPost = this.postRepository.create({
      text: createUserPostDto.post,
      user: user
    });
    const saveNewPost = await this.postRepository.save(newPost);
    server.emit('newPost', saveNewPost);
  }
  async findAll(server) {
    const posts = await this.postRepository.find();
    console.log(posts);
    server.emit('newPost', posts);
  }

  async handleConnection(socketId: Socket, server, email:string) {
    try {

        this.findAll(server);
        if (!this.isconnected.has(email)) {
          this.isconnected.set(email,[]);
        }
        this.isconnected.get(email).push(socketId);
        socketId.on('disconnect', async () => {
          if (this.isconnected.has(email)) {
            this.isconnected.delete(email);
          }
        });
    } catch (error) {
      socketId.emit('error', 'Authentication failed');
      socketId.disconnect(true);
    }
  }

}
