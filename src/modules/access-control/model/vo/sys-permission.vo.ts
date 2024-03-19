import { Expose } from 'class-transformer';

export class SysPermissionVO {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
