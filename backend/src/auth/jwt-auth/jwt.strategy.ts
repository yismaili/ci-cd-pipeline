import { ConsoleLogger, ExecutionContext, Injectable, createParamDecorator } from '@nestjs/common';
import { PassportStrategy} from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     return request?.cookies?.authorization;
      //   },
      // ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    const user =  await this.authService.findOneByEmail(payload.email);
    return user;
  }
}