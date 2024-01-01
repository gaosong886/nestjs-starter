import { WinstonService } from '@gaosong886/nestjs-winston';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SysPermissionService } from '../services/sys-permission.service';
import { PaginationInputDTO } from 'src/common/dtos/pagination-input.dto';
import { PaginationOutputDTO } from 'src/common/dtos/pagination-output.dto';
import { SysPermissionEntity } from '../entities/sys-permission.entity';

@Controller('sys-permission')
export class SysPermissionController {
  constructor(
    private logger: WinstonService,
    private sysPermissionService: SysPermissionService,
  ) {
    this.logger.setContext(SysPermissionController.name);
  }

  @Get('init')
  async init(): Promise<void> {
    return await this.sysPermissionService.initPermissions();
  }

  @Post('page')
  async page(
    @Body() paginationInputDTO: PaginationInputDTO,
  ): Promise<PaginationOutputDTO<SysPermissionEntity>> {
    return await this.sysPermissionService.page(paginationInputDTO);
  }

  @Get('list')
  async list(): Promise<Array<SysPermissionEntity>> {
    return await this.sysPermissionService.list();
  }
}
