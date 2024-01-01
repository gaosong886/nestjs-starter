import { Body, Controller, Post } from '@nestjs/common';
import { PaginationInputDTO } from 'src/common/dtos/pagination-input.dto';
import { SysLogService } from '../services/sys-log.service';
import { PaginationOutputDTO } from 'src/common/dtos/pagination-output.dto';
import { SysLogEntity } from '../entities/sys-log.entity';

@Controller('sys-log')
export class SysLogController {
  constructor(private sysLogService: SysLogService) {}

  @Post('page')
  async page(
    @Body() paginationInputDTO: PaginationInputDTO,
  ): Promise<PaginationOutputDTO<SysLogEntity>> {
    return await this.sysLogService.page(paginationInputDTO);
  }

  @Post('truncate')
  async truncate(): Promise<void> {
    await this.sysLogService.delete();
  }
}
