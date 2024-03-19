import { Optional } from '@nestjs/common';
import { IsArray, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { IsLetterOrNumber } from 'src/common/decorator/is-letter-or-number.decorator';

export class SysRoleDTO {
  @IsNotEmpty()
  @MaxLength(31)
  @IsLetterOrNumber()
  name: string;

  @Optional()
  @MaxLength(255)
  @IsLetterOrNumber()
  description?: string;

  @IsArray()
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  menuIds: number[];
}
