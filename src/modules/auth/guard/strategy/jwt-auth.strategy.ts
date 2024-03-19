import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY_JWT_AUTH } from '../../constant';
import { JwtPayloadDTO } from '../../model/dto/jwt-payload.dto';
import { plainToInstance } from 'class-transformer';
import { TOKEN_TYPE } from '../../constant/token-type.enum';

/**
 * Jwt 认证策略
 */
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_AUTH,
) {
  constructor(configService: ConfigService) {
    super({
      // 从 Header 中获取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.publicKey'),
      algorithms: ['RS256'],
    });
  }

  async validate(claims: any): Promise<JwtPayloadDTO> {
    // 只能用 accessToken 访问，不能用 refreshToken
    if (!claims.user || claims.type != TOKEN_TYPE.ACCESS) {
      throw new UnauthorizedException('Invalid token.');
    }

    // 返回 Jwt 解密后的 Payload，request 中会自动添加一个 user 对象
    return plainToInstance(JwtPayloadDTO, claims.user, {
      excludeExtraneousValues: true,
    });
  }
}
