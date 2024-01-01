import {
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  IsString,
} from 'class-validator';
import { ACCOUNT_STATUS } from '../constants/account-status.constant';
import { Transform } from 'class-transformer';

export class UpdateSysUserInputDTO {
  @MaxLength(32)
  @MinLength(5)
  @IsString()
  username: string;

  @IsOptional()
  @MaxLength(32)
  @MinLength(8)
  @IsString()
  password?: string;

  @MaxLength(32)
  @MinLength(1)
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  photo?: string;

  @IsOptional()
  @IsEnum(ACCOUNT_STATUS)
  @Transform((param) => Number(param.value))
  accountStatus?: ACCOUNT_STATUS = ACCOUNT_STATUS.ACTIVE;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  remark?: string;

  @IsArray()
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  roleIds: number[];
}
