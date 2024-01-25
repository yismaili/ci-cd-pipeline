import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserInfoDto } from './DTO/UserInfoDto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private jwtService: JwtService,
    ) {}
  
    async createUser(createUserDto: UserInfoDto): Promise<{ user: User; token: string }> {

      const saltOrRounds = 10;
      const passworHashed = await bcrypt.hash(createUserDto.password, saltOrRounds);
    
      const user = this.usersRepository.create({ 
            firstName: createUserDto.firstName, 
            lastName: createUserDto.lastName, 
            email: createUserDto.email, 
            password: passworHashed 
        });
        
      const savedUser = await this.usersRepository.save(user);
      if (!savedUser) {
        throw new UnauthorizedException('Failed to create user');
      }
    
      const token = await this.generateToken(savedUser);
      return { user: savedUser, token };
    }
    
    async generateToken(user: User):Promise<any> {
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