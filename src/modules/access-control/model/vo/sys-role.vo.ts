import { Expose, Type } from 'class-transformer';
import { SysMenuVO } from './sys-menu.vo';

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
  @Type(() => SysMenuVO)
  menus: SysMenuVO[];
}
