import { FindManyOptions, Repository } from 'typeorm';
import { PaginationVO } from '../model/vo/pagination.vo';

declare module 'typeorm' {
  export interface Repository<Entity> {
    paginate(
      page: number,
      pageSize: number,
      findManyOptions: FindManyOptions,
    ): Promise<PaginationVO<Entity>>;
  }
}

/**
 * 简易分页方法
 *
 */
export function extendRepositoryWithPagination() {
  Repository.prototype.paginate = async function (
    page: number,
    pageSize: number,
    findManyOptions: FindManyOptions,
  ): Promise<PaginationVO<any>> {
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
