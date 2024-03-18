import { WinstonService } from '@gaosong886/nestjs-winston';
import { ConflictException, Injectable } from '@nestjs/common';
import { SysMenuEntity } from '../entities/sys-menu.entity';
import { DataSource, FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysMenuInputDTO } from '../dtos/sys-menu-input.dto';
import { plainToInstance } from 'class-transformer';
import { SysPermissionEntity } from '../entities/sys-permission.entity';
import { MENU_TYPE } from '../constants/menu-type.enum';
import { SysRoleService } from './sys-role.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import _ from 'lodash';

@Injectable()
export class SysMenuService {
  constructor(
    private i18n: I18nService,
    private winstonService: WinstonService,
    @InjectRepository(SysMenuEntity)
    private sysMenuRepository: Repository<SysMenuEntity>,
    @InjectRepository(SysPermissionEntity)
    private sysPermissionRepository: Repository<SysPermissionEntity>,
    private sysRoleService: SysRoleService,
    private dataSource: DataSource,
  ) {
    this.winstonService.setContext(SysMenuService.name);
  }

  async create(sysMenuInputDTO: SysMenuInputDTO): Promise<SysMenuEntity> {
    const entity = plainToInstance(SysMenuEntity, sysMenuInputDTO);

    if (entity.type === MENU_TYPE.OPERATION) {
      entity.permissions = await this.sysPermissionRepository.find({
        where: { id: In(_.uniq(sysMenuInputDTO.permissionIds)) },
      });
    }

    return await this.sysMenuRepository.save(entity);
  }

  async update(id: number, sysMenuInputDTO: SysMenuInputDTO): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(SysMenuEntity, {
        relations: ['roles'],
        where: { id: id },
      });
      entity.name = sysMenuInputDTO.name;
      entity.type = sysMenuInputDTO.type;
      entity.icon = sysMenuInputDTO.icon;
      entity.path = sysMenuInputDTO.path;
      entity.parentId = sysMenuInputDTO.parentId;
      entity.sortWeight = sysMenuInputDTO.sortWeight;
      entity.hidden = sysMenuInputDTO.isHidden;
      if (entity.type === MENU_TYPE.OPERATION)
        entity.permissions = await manager.find(SysPermissionEntity, {
          where: { id: In(_.uniq(sysMenuInputDTO.permissionIds)) },
        });

      await manager.save(entity);

      if (entity.type === MENU_TYPE.OPERATION && entity.roles)
        await this.syncRolePermissionsByRoleIds(
          entity.roles.map((role) => role.id),
        );
    });
  }

  async hide(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(SysMenuEntity, {
        where: { id: id },
      });
      entity.hidden = entity.hidden ? 0 : 1;
      await manager.save(entity);
    });
  }

  async syncRolePermissionsByRoleIds(roleIds: number[]) {
    for (const roleId of roleIds) {
      const menus = await this.sysMenuRepository
        .createQueryBuilder('menu')
        .leftJoin('menu.roles', 'role')
        .leftJoinAndSelect('menu.permissions', 'permission')
        .where('menu.type = :type', { type: MENU_TYPE.OPERATION })
        .andWhere('role.id = :id', { id: roleId })
        .getMany();
      const permissions = [];
      for (const menu of menus) {
        for (const perm of menu.permissions) {
          permissions.push(perm.name);
        }
      }
      await this.sysRoleService.saveRolePermissionsToCache(
        roleId,
        _.uniq(permissions),
      );
    }
  }

  async delete(id: number): Promise<void> {
    const childMenus = await this.sysMenuRepository.find({
      where: { parentId: id },
    });
    if (childMenus.length > 0) {
      throw new ConflictException(
        this.i18n.t('error.DELETE_MENU_FAILED', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(SysMenuEntity, {
        relations: ['roles'],
        where: { id: id },
      });
      await manager.delete(SysMenuEntity, { id: entity.id });
      if (entity.type === MENU_TYPE.OPERATION)
        if (entity.roles.length > 0) {
          const roleIds = entity.roles.map((role) => role.id);
          await this.syncRolePermissionsByRoleIds(roleIds);
        }
    });
  }

  async list(
    findManyOptions?: FindManyOptions<SysMenuEntity>,
  ): Promise<Array<SysMenuEntity>> {
    return await this.sysMenuRepository.find({
      ...findManyOptions,
      relations: ['permissions'],
      order: { sortWeight: 'ASC' },
    });
  }

  async listByRoleIds(
    roleIds: number[],
    withHiddenMenus?: boolean,
    withPermissions?: boolean,
  ) {
    const query = this.sysMenuRepository
      .createQueryBuilder('menu')
      .leftJoin('menu.roles', 'role')
      .where('menu.type != :type', { type: MENU_TYPE.OPERATION })
      .addOrderBy('menu.sortWeight');

    // Role administrator ignores where-condition of `role.id`
    if (!roleIds.includes(1))
      query.andWhere('role.id IN (:...roleIds)', { roleIds });

    if (!withHiddenMenus) query.andWhere('menu.hidden = 0');
    if (withPermissions)
      query.leftJoinAndSelect('menu.permissions', 'permission');

    return await query.getMany();
  }
}
