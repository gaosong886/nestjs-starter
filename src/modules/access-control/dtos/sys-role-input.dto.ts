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
  @MaxLength(31)
  @IsString()
  name: string;

  @Optional()
  @MaxLength(255)
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
