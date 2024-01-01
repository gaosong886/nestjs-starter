import { WinstonService } from '@gaosong886/nestjs-winston';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { SysRoleService } from '../services/sys-role.service';
import { SysRoleInputDTO } from '../dtos/sys-role-input.dto';
import { SysRoleEntity } from '../entities/sys-role.entity';

@Controller('sys-role')
export class SysRoleController {
  constructor(
    private logger: WinstonService,
    private sysRoleService: SysRoleService,
  ) {
    this.logger.setContext(SysRoleController.name);
  }

  @Post('create')
  async create(
    @Body() sysRoleInputDTO: SysRoleInputDTO,
  ): Promise<SysRoleEntity> {
    return await this.sysRoleService.create(sysRoleInputDTO);
  }

  @Post('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sysRoleInputDTO: SysRoleInputDTO,
  ): Promise<void> {
    await this.sysRoleService.update(id, sysRoleInputDTO);
  }

  @Post('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sysRoleService.delete(id);
  }

  @SerializeOptions({
    ignoreDecorators: true,
  })
  @Get('list')
  async list(): Promise<Array<SysRoleEntity>> {
    return await this.sysRoleService.list();
  }
}
