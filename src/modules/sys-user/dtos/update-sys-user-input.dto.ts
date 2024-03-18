import {
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  IsUrl,
} from 'class-validator';
import { ACCOUNT_STATUS } from '../constants/account-status.enum';
import { Transform } from 'class-transformer';
import { IsLetterOrNumber } from 'src/common/decorators/is-letter-or-number.decorator';

export class UpdateSysUserInputDTO {
  @MaxLength(15)
  @MinLength(5)
  @IsLetterOrNumber()
  username: string;

  @IsOptional()
  @MaxLength(15)
  @MinLength(8)
  @IsLetterOrNumber()
  password?: string;

  @MaxLength(15)
  @MinLength(1)
  @IsLetterOrNumber()
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
  @IsLetterOrNumber()
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
