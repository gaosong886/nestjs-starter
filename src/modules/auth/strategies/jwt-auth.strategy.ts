import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY_JWT_AUTH } from '../constants';
import { JwtPayloadDTO } from '../dtos/jwt-payload.dto';
import { plainToInstance } from 'class-transformer';
import { TOKEN_TYPE } from '../constants/token-type.enum';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_AUTH,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: ['RS256'],
    });
  }

  async validate(claims: any): Promise<JwtPayloadDTO> {
    if (!claims.user || claims.type != TOKEN_TYPE.ACCESS) {
      throw new UnauthorizedException('Invalid token.');
    }
    return plainToInstance(JwtPayloadDTO, claims.user, {
      excludeExtraneousValues: true,
    });
  }
}
