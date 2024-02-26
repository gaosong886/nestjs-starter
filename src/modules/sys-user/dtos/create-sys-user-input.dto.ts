import { IsString, MaxLength, MinLength } from 'class-validator';
import { UpdateSysUserInputDTO } from './update-sys-user-input.dto';

export class CreateSysUserInputDTO extends UpdateSysUserInputDTO {
  @MaxLength(15)
  @MinLength(5)
  @IsString()
  username: string;

  @MaxLength(15)
  @MinLength(8)
  @IsString()
  password: string;
}
