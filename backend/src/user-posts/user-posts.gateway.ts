import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { UserPostsService } from './user-posts.service';
import { CreateUserPostDto } from './dto/create-user-post.dto';
import { Socket, Server } from 'socket.io';
import { verify } from 'jsonwebtoken';

@WebSocketGateway({cors: { origin: '*' }})
export class UserPostsGateway {
  constructor(private readonly userPostsService: UserPostsService) {}
  @WebSocketServer() server: Server;
  handleConnection(client: Socket) {
    try{
      const jwtSecret = process.env.JWT_SECRET;
      const token = client.handshake.headers.authorization.split(' ')[1];
      if (!token) {
          // client.emit('error', 'Authorization token missing');
          // client.disconnect(true);
          return;
        }
        
        let decodedToken = verify(token, jwtSecret);
        const email = decodedToken['email'];
      this.userPostsService.handleConnection(client,this.server, email);
    }catch(error){
      return ;
    }
  }
  @SubscribeMessage('createUserPost')
  create(@MessageBody() createUserPostDto: CreateUserPostDto, @ConnectedSocket() client: Socket) {
    console.log(createUserPostDto)
    return this.userPostsService.create(createUserPostDto, client, this.server);
  }
}
