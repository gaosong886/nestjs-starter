import { WinstonService } from '@gaosong886/nestjs-winston';
import { ConflictException, Injectable } from '@nestjs/common';
import { SysMenuEntity } from '../model/entity/sys-menu.entity';
import { DataSource, FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SysMenuDTO } from '../model/dto/sys-menu.dto';
import { plainToInstance } from 'class-transformer';
import { SysPermissionEntity } from '../model/entity/sys-permission.entity';
import { MENU_TYPE } from '../constant/menu-type.enum';
import { SysRoleService } from './sys-role.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import _ from 'lodash';
import { SysMenuVO } from '../model/vo/sys-menu.vo';

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

  /**
   * 创建菜单节点
   * @param sysMenuDTO
   * @returns Promise<SysMenuVO> 菜单节点对象
   */
  async create(sysMenuDTO: SysMenuDTO): Promise<SysMenuVO> {
    const entity = plainToInstance(SysMenuEntity, sysMenuDTO);

    // 类型为 '操作' 的节点，找出其对应的权限
    if (entity.type === MENU_TYPE.OPERATION) {
      entity.permissions = await this.sysPermissionRepository.find({
        where: { id: In(_.uniq(sysMenuDTO.permissionIds)) },
      });
    }

    await this.sysMenuRepository.insert(entity);
    return plainToInstance(SysMenuVO, entity);
  }

  /**
   * 更新节点
   * @param id 节点 id
   * @param sysMenuDTO
   */
  async update(id: number, sysMenuDTO: SysMenuDTO): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(SysMenuEntity, {
        relations: ['roles'], // 关联查询角色表
        where: { id: id },
      });
      entity.name = sysMenuDTO.name;
      entity.type = sysMenuDTO.type;
      entity.icon = sysMenuDTO.icon;
      entity.path = sysMenuDTO.path;
      entity.parentId = sysMenuDTO.parentId;
      entity.sortWeight = sysMenuDTO.sortWeight;
      entity.hidden = sysMenuDTO.hidden;

      // 类型为 '操作' 的节点，找出其对应的权限
      if (entity.type === MENU_TYPE.OPERATION) {
        entity.permissions = await manager.find(SysPermissionEntity, {
          where: { id: In(_.uniq(sysMenuDTO.permissionIds)) },
        });
      }

      await manager.save(entity, {
        reload: false,
        transaction: false,
      });

      // 类型为 '操作' 的节点，同步关联角色的权限集合
      if (entity.type === MENU_TYPE.OPERATION && entity.roles)
        await this.syncRolePermissionsByRoleIds(
          entity.roles.map((role) => role.id),
        );
    });
  }

  /**
   * 显示 / 隐藏菜单节点
   * @param id 节点 id
   */
  async hide(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(SysMenuEntity, {
        where: { id: id },
      });
      entity.hidden = entity.hidden ? 0 : 1;
      await manager.save(entity, {
        reload: false,
        transaction: false,
      });
    });
  }

  /**
   * 删除节点
   * @param id 节点 id
   */
  async delete(id: number): Promise<void> {
    const childMenus = await this.sysMenuRepository.find({
      where: { parentId: id },
    });

    // 不能删除有子节点的节点
    if (childMenus.length > 0) {
      throw new ConflictException(
        this.i18n.t('error.DELETE_MENU_FAILED', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // 为了删除节点相关权限，先把有访问权限的角色查询出来
      const entity = await manager.findOne(SysMenuEntity, {
        relations: ['roles'],
        where: { id: id },
      });
      await manager.delete(SysMenuEntity, { id: entity.id });

      // 类型为 '操作' 的节点，同步关联角色的权限集合
      if (entity.type === MENU_TYPE.OPERATION) {
        if (entity.roles.length > 0) {
          const roleIds = entity.roles.map((role) => role.id);
          await this.syncRolePermissionsByRoleIds(roleIds);
        }
      }
    });
  }

  /**
   * 列表查询
   * @param findManyOptions 查询选项
   * @returns Promise<Array<SysMenuVO>> 菜单节点列表
   */
  async list(
    findManyOptions?: FindManyOptions<SysMenuEntity>,
  ): Promise<Array<SysMenuVO>> {
    const list = await this.sysMenuRepository.find({
      ...findManyOptions,
      relations: ['permissions'],
      order: { sortWeight: 'ASC' },
    });
    return plainToInstance(SysMenuVO, list);
  }

  /**
   * 查询角色对应的菜单
   * @param roleIds 角色 id 数组
   * @returns Promise<Array<SysMenuVO>> 菜单节点列表
   */
  async listByRoleIds(roleIds: number[]): Promise<Array<SysMenuVO>> {
    const query = this.sysMenuRepository
      .createQueryBuilder('menu')
      .leftJoin('menu.roles', 'role')
      .where('menu.type != :type', { type: MENU_TYPE.OPERATION })
      .addOrderBy('menu.sortWeight');

    // 管理员角色不需要 roleId 查询条件
    if (!roleIds.includes(1))
      query.andWhere('role.id IN (:...roleIds)', { roleIds });

    const list: SysMenuEntity[] = await query.getMany();
    return plainToInstance(SysMenuVO, list);
  }

  /**
   * 同步 roleIds 中各个角色的权限集合
   * @param roleIds 角色 id 数组
   */
  private async syncRolePermissionsByRoleIds(roleIds: number[]) {
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
}
