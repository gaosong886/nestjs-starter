import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysRoleEntity } from './entities/sys-role.entity';
import { SysPermissionEntity } from './entities/sys-permission.entity';
import { SysRoleService } from './services/sys-role.service';
import { SysRoleController } from './controllers/sys-role.controller';
import { SysPermissionService } from './services/sys-permission.service';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { SysPermissionController } from './controllers/sys-permission.controller';
import { SysMenuController } from './controllers/sys-menu.controller';
import { SysMenuService } from './services/sys-menu.service';
import { SysMenuEntity } from './entities/sys-menu.entity';
import { SysLogService } from './services/sys-log.service';
import { SysLogEntity } from './entities/sys-log.entity';
import { SysLogController } from './controllers/sys-log.controller';

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
