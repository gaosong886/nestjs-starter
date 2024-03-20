import { Expose, Type } from 'class-transformer';
import { SysUserVO } from 'src/modules/sys-user/model/vo/sys-user.vo';

export class SysLogVO {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  ip: string;

  @Expose()
  url: string;

  @Expose()
  params: string;

  @Expose()
  requestAt: Date;

  @Expose()
  @Type(() => SysUserVO)
  user: SysUserVO;
}
