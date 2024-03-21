import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { IsLetterOrNumber } from 'src/common/decorator/is-letter-or-number.decorator';

/**
 * 通用分页请求参数封装
 */
export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  @Transform((param) => parseInt(param.value))
  page = 1;

  @IsOptional()
  @IsPositive()
  @Transform((param) => parseInt(param.value))
  pageSize = 50;

  @IsOptional()
  @IsLetterOrNumber()
  query?: string;
}
