import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY_JWT_AUTH } from '../constants';
import { JwtTokenPayloadDTO } from '../dtos/jwt-token-payload.dto';
import { plainToInstance } from 'class-transformer';

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

  async validate(payload: any): Promise<JwtTokenPayloadDTO> {
    if (!payload.user) new UnauthorizedException(`Illegal token.`);
    return plainToInstance(JwtTokenPayloadDTO, payload.user, {
      excludeExtraneousValues: true,
    });
  }
}
