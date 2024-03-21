import { Expose, Type } from 'class-transformer';
import { SysMenuLiteVO } from './sys-menu-lite.vo';

export class SysRoleVO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createAt: Date;

  @Expose()
  updateAt: Date;

  @Expose()
  @Type(() => SysMenuLiteVO)
  menus: SysMenuLiteVO[];
}
