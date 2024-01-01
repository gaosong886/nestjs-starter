import { FindManyOptions, Repository } from 'typeorm';
import { PaginationOutputDTO } from '../dtos/pagination-output.dto';

declare module 'typeorm' {
  export interface Repository<Entity> {
    paginate(
      page: number,
      pageSize: number,
      findManyOptions: FindManyOptions,
    ): Promise<PaginationOutputDTO<Entity>>;
  }
}

export function extendRepositoryWithPagination() {
  Repository.prototype.paginate = async function (
    page: number,
    pageSize: number,
    findManyOptions: FindManyOptions,
  ): Promise<PaginationOutputDTO<any>> {
    const totalItems = await this.count(findManyOptions);
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (page - 1) * pageSize;
    const data = await this.find({
      ...findManyOptions,
      skip: skip,
      take: pageSize,
    });

    return {
      totalItems,
      totalPages,
      pageSize,
      page,
      data,
    };
  };
}
