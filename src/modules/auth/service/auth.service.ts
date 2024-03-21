import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { JwtTokenVO } from '../model/vo/jwt-token.vo';
import { JwtPayloadDTO } from '../model/dto/jwt-payload.dto';
import { SysUserService } from 'src/modules/sys-user/service/sys-user.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { LoginDTO } from '../model/dto/login-dto.dto';
import { ACCOUNT_STATUS } from 'src/modules/sys-user/constant/account-status.enum';
import { JWT_TOKEN_TYPE } from '../constant';
import { TOKEN_TYPE } from '../constant/token-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private i18n: I18nService,
    private sysUserService: SysUserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 登录验证
   * @param loginDTO
   * @returns Promise<JwtTokenVO> Token 对象
   */
  async verifySysUser(loginDTO: LoginDTO): Promise<JwtTokenVO> {
    const user = await this.sysUserService.verify(
      loginDTO.username,
      loginDTO.password,
    );

    return this.generateAuthToken(
      plainToInstance(JwtPayloadDTO, instanceToPlain(user)),
    );
  }

  /**
   * 刷新 Token
   * @param req 请求对象
   * @returns Promise<JwtTokenVO> Token 对象
   */
  async refreshAuthToken(req: Request): Promise<JwtTokenVO> {
    const user = await this.sysUserService.getSysUserFromCache(req.user.id);

    // 如果用户已被封禁，抛出异常
    if (!user || user.accountStatus == ACCOUNT_STATUS.BANNED) {
      throw new UnauthorizedException(
        this.i18n.t('error.INVALID_USER', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return this.generateAuthToken(
      plainToInstance(JwtPayloadDTO, instanceToPlain(user)),
    );
  }

  /**
   * 生成 Token
   * @param payload Jwt 载荷
   * @returns JwtTokenVO 对象
   */
  private generateAuthToken(payload: JwtPayloadDTO): JwtTokenVO {
    const authToken = {
      tokenType: JWT_TOKEN_TYPE,
      accessToken: this.jwtService.sign(
        { type: TOKEN_TYPE.ACCESS, user: payload },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
      accessTokenExpiresInSec: this.configService.get(
        'jwt.accessTokenExpiresInSec',
      ),
      refreshToken: this.jwtService.sign(
        { type: TOKEN_TYPE.REFRESH, user: { id: payload.id } },
        {
          expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
        },
      ),
      refreshTokenExpiresInSec: this.configService.get(
        'jwt.refreshTokenExpiresInSec',
      ),
    };

    return plainToInstance(JwtTokenVO, authToken);
  }
}
