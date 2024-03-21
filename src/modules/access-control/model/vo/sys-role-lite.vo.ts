import { Expose } from 'class-transformer';

export class SysRoleLiteVO {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
