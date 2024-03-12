import {
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  IsUrl,
} from 'class-validator';
import { ACCOUNT_STATUS } from '../constants/account-status.constant';
import { Transform } from 'class-transformer';
import { IsStringStrict } from 'src/common/decorators/is-string-strict.decorator';

export class UpdateSysUserInputDTO {
  @MaxLength(15)
  @MinLength(5)
  @IsStringStrict()
  username: string;

  @IsOptional()
  @MaxLength(15)
  @MinLength(8)
  @IsStringStrict()
  password?: string;

  @MaxLength(15)
  @MinLength(1)
  @IsStringStrict()
  nickname: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  photo?: string;

  @IsOptional()
  @IsEnum(ACCOUNT_STATUS)
  @Transform((param) => Number(param.value))
  accountStatus?: ACCOUNT_STATUS = ACCOUNT_STATUS.ACTIVE;

  @IsOptional()
  @IsStringStrict()
  @MaxLength(255)
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
