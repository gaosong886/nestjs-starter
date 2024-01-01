import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY_JWT_REFRESH } from '../constants';
import { JwtTokenPayloadDTO } from '../dtos/jwt-token-payload.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_REFRESH,
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<JwtTokenPayloadDTO> {
    return plainToInstance(
      JwtTokenPayloadDTO,
      { id: payload.sub },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
