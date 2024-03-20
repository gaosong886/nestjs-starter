import { Expose, Type } from 'class-transformer';
import { SysRoleVO } from 'src/modules/access-control/model/vo/sys-role.vo';

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
  @Type(() => SysRoleVO)
  roles: SysRoleVO[];
}
