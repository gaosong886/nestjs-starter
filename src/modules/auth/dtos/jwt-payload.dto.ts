import { Expose } from 'class-transformer';

export class JwtPayloadDTO {
  @Expose()
  id: number;

  @Expose()
  username?: string;

  @Expose()
  roles?: {
    id: number;
    name: string;
  }[];
}
