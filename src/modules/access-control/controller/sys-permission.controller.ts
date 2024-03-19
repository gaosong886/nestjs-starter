import { WinstonService } from '@gaosong886/nestjs-winston';
import { Controller, Get } from '@nestjs/common';
import { SysPermissionService } from '../service/sys-permission.service';
import { SysPermissionVO } from '../model/vo/sys-permission.vo';

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

  @Get('list')
  async list(): Promise<Array<SysPermissionVO>> {
    return await this.sysPermissionService.list();
  }
}
