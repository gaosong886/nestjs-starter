import { Length } from 'class-validator';
import { IsLetterOrNumber } from 'src/common/decorator/is-letter-or-number.decorator';

export class LoginDTO {
  @Length(5, 32)
  @IsLetterOrNumber()
  username: string;

  @Length(8, 32)
  // @IsStrongPassword()
  @IsLetterOrNumber()
  password: string;
}
