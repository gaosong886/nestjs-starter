import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { SysLogEntity } from '../model/entity/sys-log.entity';
import { PaginationDTO } from 'src/common/model/dto/pagination.dto';
import { PaginationVO } from 'src/common/model/vo/pagination.vo';
import { instanceToPlain, plainToInstance } from 'class-transformer';
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
  ): Promise<SysLogVO> {
    const entity = new SysLogEntity();
    entity.userId = userId;
    entity.ip = ip;
    entity.url = url;
    entity.params = params;
    await this.sysLogRepository.save(entity);
    return plainToInstance(SysLogVO, entity);
  }

  /**
   * 分页查询
   *
   */
  async page(
    paginationDTO: PaginationDTO,
    findManyOptions?: FindManyOptions<SysLogEntity>,
  ): Promise<PaginationVO<SysLogVO>> {
    let options = {};

    if (paginationDTO.query) {
      // 可以根据 URL 模糊查询
      options = {
        where: [{ url: Like(`%${paginationDTO.query}%`) }],
      };
    }

    const page = await this.sysLogRepository.paginate(
      paginationDTO.page,
      paginationDTO.pageSize,
      {
        ...options,
        ...findManyOptions,
        order: { requestAt: 'DESC' },
        relations: ['user'],
      },
    );

    // 这里 PaginationVO 使用了泛型
    // 需要先把 page 转换成 plainObject，否则 class-transformer 无法正常转换
    return plainToInstance(PaginationVO<SysLogVO>, instanceToPlain(page));
  }

  /**
   * 清空日志
   *
   */
  async deleteAll() {
    await this.sysLogRepository.delete({});
  }
}
