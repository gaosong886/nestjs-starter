import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { IsFilePath } from 'src/common/decorators/is-file-path.decorator';
import { IsStringStrict } from 'src/common/decorators/is-string-strict.decorator';

export class SysMenuInputDTO {
  @IsNotEmpty()
  @MaxLength(15)
  @IsStringStrict()
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
