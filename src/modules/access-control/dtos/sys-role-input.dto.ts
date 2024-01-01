import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class SysRoleInputDTO {
  @IsNotEmpty()
  @MaxLength(32)
  @IsString()
  name: string;

  @Optional()
  @MaxLength(256)
  @IsString()
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
