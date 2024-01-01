import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginInputDTO {
  @MaxLength(32)
  @MinLength(5)
  @IsString()
  username: string;

  @MaxLength(32)
  @MinLength(8)
  @IsString()
  password: string;
}
