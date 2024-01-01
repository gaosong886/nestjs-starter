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
import { SysMenuService } from '../services/sys-menu.service';
import { SysMenuInputDTO } from '../dtos/sys-menu-input.dto';
import { SysMenuEntity } from '../entities/sys-menu.entity';
import { Request } from 'express';
import { AvoidPermission } from '../decorators/avoid-permission.decorator';

@Controller('sys-menu')
export class SysMenuController {
  constructor(
    private logger: WinstonService,
    private sysMenuService: SysMenuService,
  ) {
    this.logger.setContext(SysMenuController.name);
  }

  @Post('create')
  async create(
    @Body() sysMenuInputDTO: SysMenuInputDTO,
  ): Promise<SysMenuEntity> {
    return await this.sysMenuService.create(sysMenuInputDTO);
  }

  @Post('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sysMenuInputDTO: SysMenuInputDTO,
  ): Promise<void> {
    await this.sysMenuService.update(id, sysMenuInputDTO);
  }

  @Get('list')
  async list(): Promise<Array<SysMenuEntity>> {
    return await this.sysMenuService.list();
  }

  @AvoidPermission()
  @Get('menu')
  async menu(@Req() req: Request): Promise<Array<SysMenuEntity>> {
    return await this.sysMenuService.listByRoleIds(
      req.user.roles.map((item) => item.id),
      false,
      false,
    );
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
