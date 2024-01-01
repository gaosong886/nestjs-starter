export class PaginationOutputDTO<T> {
  totalItems?: number;
  totalPages?: number;
  pageSize: number;
  page: number;
  data: T[];
}
