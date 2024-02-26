import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SysMenuInputDTO {
  @IsNotEmpty()
  @MaxLength(15)
  @IsString()
  name: string;

  @IsNumber()
  @Transform((param) => parseInt(param.value))
  type: number;

  @IsOptional()
  @MaxLength(255)
  @IsString()
  icon: string;

  @IsOptional()
  @IsNumber()
  @Transform((param) => parseInt(param.value))
  parentId: number = 0;

  @IsOptional()
  @MaxLength(255)
  @IsString()
  path: string;

  @IsOptional()
  @IsNumber()
  @Transform((param) => parseInt(param.value))
  sortWeight: number = 0;

  @IsOptional()
  @IsNumber()
  @Transform((param) => Number(param.value))
  isHidden: number = 0;

  @IsOptional()
  @IsArray()
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  permissionIds: number[] = [];
}
