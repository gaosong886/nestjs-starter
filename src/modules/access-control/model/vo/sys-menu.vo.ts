import { Expose, Type } from 'class-transformer';
import { SysPermissionVO } from './sys-permission.vo';

export class SysMenuVO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  type: number;

  @Expose()
  icon: string;

  @Expose()
  parentId: number;

  @Expose()
  path: string;

  @Expose()
  sortWeight: number;

  @Expose()
  hidden: number;

  @Expose()
  @Type(() => SysPermissionVO)
  permissions: SysPermissionVO[];
}
