import { Expose, Type } from 'class-transformer';
import { SysRoleLiteVO } from 'src/modules/access-control/model/vo/sys-role-lite.vo';

export class SysUserVO {
  @Expose()
  id: number;

  @Expose()
  photo: string;

  @Expose()
  nickname: string;

  @Expose()
  username: string;

  @Expose()
  accountStatus: number;

  @Expose()
  remark: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;

  @Expose()
  @Type(() => SysRoleLiteVO)
  roles: SysRoleLiteVO[];
}
