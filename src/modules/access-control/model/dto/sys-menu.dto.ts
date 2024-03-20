import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { IsFilePath } from 'src/common/decorator/is-file-path.decorator';
import { IsLetterOrNumber } from 'src/common/decorator/is-letter-or-number.decorator';

export class SysMenuDTO {
  @IsNotEmpty()
  @MaxLength(15)
  @IsLetterOrNumber()
  name: string;

  @IsNumber()
  @Transform((param) => parseInt(param.value))
  type: number;

  @IsOptional()
  @MaxLength(255)
  @IsAlphanumeric()
  icon: string;

  @IsOptional()
  @IsNumber()
  @Transform((param) => parseInt(param.value))
  parentId: number = 0;

  @IsOptional()
  @MaxLength(255)
  @IsFilePath()
  path: string;

  @IsOptional()
  @IsNumber()
  @Transform((param) => parseInt(param.value))
  sortWeight: number = 0;

  @IsOptional()
  @IsNumber()
  @Transform((param) => Number(param.value))
  hidden: number = 0;

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
