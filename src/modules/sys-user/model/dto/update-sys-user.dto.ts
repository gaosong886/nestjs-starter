import {
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  MaxLength,
  IsUrl,
  Length,
} from 'class-validator';
import { ACCOUNT_STATUS } from '../../constant/account-status.enum';
import { Transform } from 'class-transformer';
import { IsLetterOrNumber } from 'src/common/decorator/is-letter-or-number.decorator';

export class UpdateSysUserDTO {
  @Length(5, 15)
  @IsLetterOrNumber()
  username: string;

  @IsOptional()
  @Length(8, 15)
  @IsLetterOrNumber()
  password?: string;

  @Length(1, 15)
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
