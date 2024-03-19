import { Body, Controller, Post } from '@nestjs/common';
import { PaginationDTO } from 'src/common/model/dto/pagination.dto';
import { SysLogService } from '../service/sys-log.service';
import { PaginationVO } from 'src/common/model/vo/pagination.vo';
import { SysLogVO } from '../model/vo/sys-log.vo';

@Controller('sys-log')
export class SysLogController {
  constructor(private sysLogService: SysLogService) {}

  @Post('page')
  async page(
    @Body() paginationInputDTO: PaginationDTO,
  ): Promise<PaginationVO<SysLogVO>> {
    return await this.sysLogService.page(paginationInputDTO);
  }

  @Post('truncate')
  async truncate(): Promise<void> {
    await this.sysLogService.deleteAll();
  }
}
