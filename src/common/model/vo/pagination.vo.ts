import { Expose } from 'class-transformer';

/**
 * 通用分页数据封装
 */
export class PaginationVO<T> {
  @Expose()
  totalItems?: number;

  @Expose()
  totalPages?: number;

  @Expose()
  pageSize: number;

  @Expose()
  page: number;

  @Expose()
  data: T[];
}
