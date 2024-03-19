import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysRoleEntity } from './model/entity/sys-role.entity';
import { SysPermissionEntity } from './model/entity/sys-permission.entity';
import { SysRoleService } from './service/sys-role.service';
import { SysRoleController } from './controller/sys-role.controller';
import { SysPermissionService } from './service/sys-permission.service';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { SysPermissionController } from './controller/sys-permission.controller';
import { SysMenuController } from './controller/sys-menu.controller';
import { SysMenuService } from './service/sys-menu.service';
import { SysMenuEntity } from './model/entity/sys-menu.entity';
import { SysLogService } from './service/sys-log.service';
import { SysLogEntity } from './model/entity/sys-log.entity';
import { SysLogController } from './controller/sys-log.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SysRoleEntity,
      SysMenuEntity,
      SysPermissionEntity,
      SysLogEntity,
    ]),
  ],
  providers: [
    SysRoleService,
    SysMenuService,
    SysPermissionService,
    SysLogService,
    DiscoveryService,
    MetadataScanner,
  ],
  exports: [SysRoleService, SysLogService],
  controllers: [
    SysRoleController,
    SysPermissionController,
    SysMenuController,
    SysLogController,
  ],
})
export class AccessControlModule {}
