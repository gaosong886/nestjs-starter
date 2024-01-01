import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { SysLogEntity } from '../entities/sys-log.entity';
import { PaginationInputDTO } from 'src/common/dtos/pagination-input.dto';
import { PaginationOutputDTO } from 'src/common/dtos/pagination-output.dto';

@Injectable()
export class SysLogService {
  constructor(
    @InjectRepository(SysLogEntity)
    private sysLogRepository: Repository<SysLogEntity>,
  ) {}

  async save(
    userId: number,
    ip: string,
    url: string,
    params: string,
  ): Promise<SysLogEntity> {
    const entity = new SysLogEntity();
    entity.userId = userId;
    entity.ip = ip;
    entity.url = url;
    entity.params = params;
    return await this.sysLogRepository.save(entity);
  }

  async page(
    inputData: PaginationInputDTO,
    findManyOptions?: FindManyOptions<SysLogEntity>,
  ): Promise<PaginationOutputDTO<SysLogEntity>> {
    let options = {};
    if (inputData.query) {
      options = {
        where: [{ url: Like(`%${inputData.query}%`) }],
      };
    }
    return await this.sysLogRepository.paginate(
      inputData.page,
      inputData.pageSize,
      {
        ...options,
        ...findManyOptions,
        order: { requestAt: 'DESC' },
        relations: ['user'],
      },
    );
  }

  async delete() {
    await this.sysLogRepository.delete({});
  }
}
