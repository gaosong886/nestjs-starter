import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationInputDTO {
  @IsNumber()
  @IsOptional()
  @Transform((param) => parseInt(param.value))
  page = 1;

  @IsNumber()
  @IsOptional()
  @Transform((param) => parseInt(param.value))
  pageSize = 50;

  @IsString()
  @IsOptional()
  query?: string;
}
