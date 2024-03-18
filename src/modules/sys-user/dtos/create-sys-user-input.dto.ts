import { MaxLength, MinLength } from 'class-validator';
import { UpdateSysUserInputDTO } from './update-sys-user-input.dto';
import { IsLetterOrNumber } from 'src/common/decorators/is-letter-or-number.decorator';

export class CreateSysUserInputDTO extends UpdateSysUserInputDTO {
  @MaxLength(15)
  @MinLength(5)
  @IsLetterOrNumber()
  username: string;

  @MaxLength(15)
  @MinLength(8)
  @IsLetterOrNumber()
  password: string;
}
