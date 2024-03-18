import { MaxLength, MinLength } from 'class-validator';
import { IsLetterOrNumber } from 'src/common/decorators/is-letter-or-number.decorator';

export class LoginInputDTO {
  @MaxLength(32)
  @MinLength(5)
  @IsLetterOrNumber()
  username: string;

  @MaxLength(32)
  @MinLength(8)
  // @IsStrongPassword()
  @IsLetterOrNumber()
  password: string;
}
