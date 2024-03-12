import { Optional } from '@nestjs/common';
import { IsArray, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { IsStringStrict } from 'src/common/decorators/is-string-strict.decorator';

export class SysRoleInputDTO {
  @IsNotEmpty()
  @MaxLength(31)
  @IsStringStrict()
  name: string;

  @Optional()
  @MaxLength(255)
  @IsStringStrict()
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
