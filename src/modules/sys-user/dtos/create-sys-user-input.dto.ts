import { MaxLength, MinLength } from 'class-validator';
import { UpdateSysUserInputDTO } from './update-sys-user-input.dto';
import { IsStringStrict } from 'src/common/decorators/is-string-strict.decorator';

export class CreateSysUserInputDTO extends UpdateSysUserInputDTO {
  @MaxLength(15)
  @MinLength(5)
  @IsStringStrict()
  username: string;

  @MaxLength(15)
  @MinLength(8)
  @IsStringStrict()
  password: string;
}
