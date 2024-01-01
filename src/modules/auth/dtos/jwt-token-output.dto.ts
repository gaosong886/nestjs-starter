import { Expose } from 'class-transformer';

export class JwtTokenOutputDTO {
  @Expose()
  tokenType: string;

  @Expose()
  accessToken: string;

  @Expose()
  accessTokenExpiresInSec: number;

  @Expose()
  refreshToken: string;

  @Expose()
  refreshTokenExpiresInSec: number;
}
