import { WinstonService } from '@gaosong886/nestjs-winston';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { SysMenuService } from '../service/sys-menu.service';
import { SysMenuDTO } from '../model/dto/sys-menu.dto';
import { Request } from 'express';
import { AvoidPermission } from '../decorator/avoid-permission.decorator';
import { SysMenuVO } from '../model/vo/sys-menu.vo';

@Controller('sys-menu')
export class SysMenuController {
  constructor(
    private logger: WinstonService,
    private sysMenuService: SysMenuService,
  ) {
    this.logger.setContext(SysMenuController.name);
  }

  @Post('create')
  async create(@Body() sysMenuDTO: SysMenuDTO): Promise<SysMenuVO> {
    return await this.sysMenuService.create(sysMenuDTO);
  }

  @Post('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sysMenuDTO: SysMenuDTO,
  ): Promise<void> {
    await this.sysMenuService.update(id, sysMenuDTO);
  }

  @Get('list')
  async list(): Promise<Array<SysMenuVO>> {
    return await this.sysMenuService.list();
  }

  @AvoidPermission()
  @Get('menu')
  async menu(@Req() req: Request): Promise<Array<SysMenuVO>> {
    const roleIds = req.user.roles.map((item) => item.id);
    // 根据用户角色查询可显示的菜单
    return await this.sysMenuService.listByRoleIds(roleIds, false, false);
  }

  @Post('hide/:id')
  async hide(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sysMenuService.hide(id);
  }

  @Post('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sysMenuService.delete(id);
  }
}
