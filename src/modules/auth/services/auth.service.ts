import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { JwtOutputDTO } from '../dtos/jwt-output.dto';
import { JwtPayloadDTO } from '../dtos/jwt-payload.dto';
import { SysUserService } from 'src/modules/sys-user/services/sys-user.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { LoginInputDTO } from '../dtos/login-input.dto';
import { ACCOUNT_STATUS } from 'src/modules/sys-user/constants/account-status.enum';
import { JWT_TOKEN_TYPE } from '../constants';
import { TOKEN_TYPE } from '../constants/token-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private i18n: I18nService,
    private sysUserService: SysUserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateSysUser(loginInputDTO: LoginInputDTO): Promise<JwtOutputDTO> {
    const user = await this.sysUserService.validate(
      loginInputDTO.username,
      loginInputDTO.password,
    );

    return this.generateAuthToken(
      plainToInstance(JwtPayloadDTO, instanceToPlain(user), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async refreshAuthToken(req: Request): Promise<JwtOutputDTO> {
    const user = await this.sysUserService.retrieveSysUserFromCache(
      req.user.id,
    );
    if (!user || user.accountStatus == ACCOUNT_STATUS.BANNED) {
      throw new UnauthorizedException(
        this.i18n.t('error.INVALID_USER', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return this.generateAuthToken(
      plainToInstance(JwtPayloadDTO, instanceToPlain(user), {
        excludeExtraneousValues: true,
      }),
    );
  }

  generateAuthToken(payload: JwtPayloadDTO): JwtOutputDTO {
    const subject = { sub: payload.id };

    const authToken = {
      tokenType: JWT_TOKEN_TYPE,
      accessToken: this.jwtService.sign(
        { type: TOKEN_TYPE.ACCESS, user: payload, ...subject },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
      accessTokenExpiresInSec: this.configService.get(
        'jwt.accessTokenExpiresInSec',
      ),
      refreshToken: this.jwtService.sign(
        { type: TOKEN_TYPE.REFRESH, ...subject },
        {
          expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
        },
      ),
      refreshTokenExpiresInSec: this.configService.get(
        'jwt.refreshTokenExpiresInSec',
      ),
    };

    return plainToInstance(JwtOutputDTO, authToken, {
      excludeExtraneousValues: true,
    });
  }
}
