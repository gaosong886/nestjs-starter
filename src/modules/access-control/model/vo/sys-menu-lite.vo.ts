import { Expose } from 'class-transformer';

export class SysMenuLiteVO {
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
}
