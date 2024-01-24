import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserInfoDto } from './DTO/UserInfoDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private jwtService: JwtService,
    ) {}
  
    async createUser(createUserDto: UserInfoDto): Promise<{ user: User; token: string }> {
      const { firstName, lastName, email, password } = createUserDto;
  
      const saltOrRounds = 10
        const passworHashed = await bcrypt.hash(createChatRoomDto.password, saltOrRounds);

      const user = this.usersRepository.create({ firstName, lastName, email, password });
      const savedUser = await this.usersRepository.save(user);
  
      if (!savedUser) {
        throw new UnauthorizedException('Failed to create user');
      }
  
      const token = this.generateToken(savedUser);
  
      return { user: savedUser, token };
    }
  
    private generateToken(user: User): string {
      const payload = { sub: user.id, email: user.email };
      return this.jwtService.sign(payload);
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({
            where: {
                email: email,
            }
        });
      }
}