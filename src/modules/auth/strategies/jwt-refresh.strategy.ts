import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY_JWT_REFRESH } from '../constants';
import { JwtPayloadDTO } from '../dtos/jwt-payload.dto';
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

  async validate(claims: any): Promise<JwtPayloadDTO> {
    return plainToInstance(
      JwtPayloadDTO,
      { id: claims.sub },
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
