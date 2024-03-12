import { MaxLength, MinLength } from 'class-validator';
import { IsStringStrict } from 'src/common/decorators/is-string-strict.decorator';

export class LoginInputDTO {
  @MaxLength(32)
  @MinLength(5)
  @IsStringStrict()
  username: string;

  @MaxLength(32)
  @MinLength(8)
  // @IsStrongPassword()
  @IsStringStrict()
  password: string;
}
