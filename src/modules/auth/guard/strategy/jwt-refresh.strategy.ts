import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY_JWT_REFRESH } from '../../constant';
import { JwtPayloadDTO } from '../../model/dto/jwt-payload.dto';
import { plainToInstance } from 'class-transformer';
import { TOKEN_TYPE } from '../../constant/token-type.enum';

/**
 * Jwt 刷新策略
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_REFRESH,
) {
  constructor(configService: ConfigService) {
    super({
      // 从请求体获取 refreshToken
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: ['RS256'],
    });
  }

  async validate(claims: any): Promise<JwtPayloadDTO> {
    // 必须是 refreshToken，不能用 accessToken 刷新
    if (!claims.user || claims.type != TOKEN_TYPE.REFRESH) {
      throw new UnauthorizedException('Invalid token.');
    }

    // 返回 Jwt 解密后的 Payload，request 中会自动添加一个 user 对象
    return plainToInstance(JwtPayloadDTO, claims.user, {
      excludeExtraneousValues: true,
    });
  }
}
