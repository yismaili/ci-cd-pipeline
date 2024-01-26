import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginDto } from './DTO/UserLoginDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService) {}

    async login(userloginDto: UserLoginDto): Promise<{ user: any; token: string }> {

      const user = await this.findOneByEmail(userloginDto.email)
      if (!user) {
        throw new UnauthorizedException('user not found');
      }
      
      const isMatch = await bcrypt.compare(userloginDto.password, user?.password);
      if (!isMatch ) {
          throw new NotFoundException('Invalid password');
      }
      const filteredUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };
    
      const token = await this.generateToken(user);
      return { user: filteredUser, token };
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
