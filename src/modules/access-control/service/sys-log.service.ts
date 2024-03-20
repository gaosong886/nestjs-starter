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
   *
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
   *
   */
  async page(
    inputData: PaginationDTO,
    findManyOptions?: FindManyOptions<SysLogEntity>,
  ): Promise<PaginationVO<SysLogVO>> {
    let options = { ...findManyOptions, relations: ['user'] };
    if (inputData.query) {
      // 可以根据 URL 模糊查询
      options = {
        ...options,
        where: [{ url: Like(`%${inputData.query}%`) }],
      };
    }

    const totalItems = await this.sysLogRepository.count(options);
    const totalPages = Math.ceil(totalItems / inputData.pageSize);
    const skip = (inputData.page - 1) * inputData.pageSize;
    const data = await this.sysLogRepository.find({
      ...options,
      skip: skip,
      take: inputData.pageSize,
    });

    return {
      totalItems,
      totalPages,
      pageSize: inputData.pageSize,
      page: inputData.page,
      data: plainToInstance(SysLogVO, data),
    };
  }

  /**
   * 清空日志
   *
   */
  async deleteAll() {
    await this.sysLogRepository.delete({});
  }
}
