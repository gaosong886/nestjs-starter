import { WinstonService } from '@gaosong886/nestjs-winston';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SysRoleService } from '../service/sys-role.service';
import { SysRoleDTO } from '../model/dto/sys-role.dto';
import { SysRoleVO } from '../model/vo/sys-role.vo';

@Controller('sys-role')
export class SysRoleController {
  constructor(
    private logger: WinstonService,
    private sysRoleService: SysRoleService,
  ) {
    this.logger.setContext(SysRoleController.name);
  }

  @Post('create')
  async create(@Body() sysRoleDTO: SysRoleDTO): Promise<SysRoleVO> {
    return await this.sysRoleService.create(sysRoleDTO);
  }

  @Post('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sysRoleInputDTO: SysRoleDTO,
  ): Promise<void> {
    await this.sysRoleService.update(id, sysRoleInputDTO);
  }

  @Post('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sysRoleService.delete(id);
  }

  @Get('list')
  async list(): Promise<Array<SysRoleVO>> {
    return await this.sysRoleService.list();
  }
}
