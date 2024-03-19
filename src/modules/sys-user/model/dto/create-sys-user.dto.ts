import { Length } from 'class-validator';
import { UpdateSysUserDTO as UpdateSysUserDTO } from './update-sys-user.dto';
import { IsLetterOrNumber } from 'src/common/decorator/is-letter-or-number.decorator';

export class CreateSysUserDTO extends UpdateSysUserDTO {
  @Length(5, 15)
  @IsLetterOrNumber()
  username: string;

  @Length(8, 15)
  @IsLetterOrNumber()
  password: string;
}
