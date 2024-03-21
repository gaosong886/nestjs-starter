import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { SysLogEntity } from '../model/entity/sys-log.entity';
import { PaginationDTO } from 'src/common/model/dto/pagination.dto';
import { PaginationVO } from 'src/common/model/vo/pagination.vo';
import { plainToInstance } from 'class-transformer';
import { SysLogVO } from '../model/vo/sys-log.vo';

@Injectable()
export class SysLogService {
  constructor(
    @InjectRepository(SysLogEntity)
    private sysLogRepository: Repository<SysLogEntity>,
  ) {}

  /**
   * 保存日志
   * @param userId
   * @param ip
   * @param url
   * @param params 请求参数
   */
  async save(
    userId: number,
    ip: string,
    url: string,
    params: string,
  ): Promise<void> {
    const entity = new SysLogEntity();
    entity.userId = userId;
    entity.ip = ip;
    entity.url = url;
    entity.params = params;
    await this.sysLogRepository.save(entity, {
      reload: false,
      transaction: false,
    });
  }

  /**
   * 分页查询
   * @param paginationDTO 分页参数
   * @param findManyOptions 查询条件
   * @returns Promise<PaginationVO<SysLogVO>> 分页数据
   */
  async page(
    paginationDTO: PaginationDTO,
    findManyOptions?: FindManyOptions<SysLogEntity>,
  ): Promise<PaginationVO<SysLogVO>> {
    let options = { ...findManyOptions, relations: ['user'] };
    if (paginationDTO.query) {
      // 可以根据 URL 模糊查询
      options = {
        ...options,
        where: [{ url: Like(`%${paginationDTO.query}%`) }],
      };
    }

    const totalItems = await this.sysLogRepository.count(options);
    const totalPages = Math.ceil(totalItems / paginationDTO.pageSize);
    const skip = (paginationDTO.page - 1) * paginationDTO.pageSize;
    const data = await this.sysLogRepository.find({
      ...options,
      skip: skip,
      take: paginationDTO.pageSize,
    });

    return {
      totalItems,
      totalPages,
      pageSize: paginationDTO.pageSize,
      page: paginationDTO.page,
      data: plainToInstance(SysLogVO, data),
    };
  }

  /**
   * 清空日志
   */
  async deleteAll() {
    await this.sysLogRepository.delete({});
  }
}
