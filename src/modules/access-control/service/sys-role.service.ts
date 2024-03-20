import { ConflictException, Injectable } from '@nestjs/common';
import { SysRoleEntity } from '../model/entity/sys-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, In, Repository } from 'typeorm';
import { WinstonService } from '@gaosong886/nestjs-winston';
import { InjectRedis, RedisClient } from '@gaosong886/nestjs-redis';
import { SYS_ROLE_PERMISSION_KEY } from '../constant/redis-keys.constant';
import { SysRoleDTO } from '../model/dto/sys-role.dto';
import { SysMenuEntity } from '../model/entity/sys-menu.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';
import _ from 'lodash';
import { SysRoleVO } from '../model/vo/sys-role.vo';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SysRoleService {
  constructor(
    private i18n: I18nService,
    private winstonService: WinstonService,
    @InjectRepository(SysRoleEntity)
    private sysRoleRepository: Repository<SysRoleEntity>,
    @InjectRepository(SysMenuEntity)
    private sysMenuRepository: Repository<SysMenuEntity>,
    @InjectRedis()
    private redisClient: RedisClient,
    private dataSource: DataSource,
  ) {
    this.winstonService.setContext(SysRoleService.name);
  }

  /**
   * 创建角色
   *
   */
  async create(sysRoleDTO: SysRoleDTO): Promise<SysRoleVO> {
    const entity = new SysRoleEntity();
    entity.name = sysRoleDTO.name;
    entity.description = sysRoleDTO.description;
    entity.menus = await this.sysMenuRepository.find({
      where: { id: In(_.uniq(sysRoleDTO.menuIds)) },
      relations: ['permissions'],
    });

    // 根据角色关联的菜单，找出对应的权限
    const permissions = [];
    entity.menus
      .filter((menu) => menu.permissions)
      .forEach((menu) =>
        menu.permissions.forEach((permission) =>
          permissions.push(permission.name),
        ),
      );

    await this.dataSource.transaction(async (manager) => {
      await manager.save(entity, {
        reload: false,
        transaction: false,
      });

      // 保存角色的权限信息到 Redis 集合
      await this.saveRolePermissionsToCache(entity.id, _.uniq(permissions));
    });
    return plainToInstance(SysRoleVO, entity);
  }

  /**
   * 更新角色
   *
   */
  async update(id: number, sysRoleInputDTO: SysRoleDTO): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = await manager.findOne(SysRoleEntity, {
        where: { id: id },
      });
      entity.name = sysRoleInputDTO.name;
      entity.description = sysRoleInputDTO.description;
      entity.menus = await manager.find(SysMenuEntity, {
        relations: ['permissions'],
        where:
          id === 1 ? undefined : { id: In(_.uniq(sysRoleInputDTO.menuIds)) },
        // 管理员有全部权限
      });

      // 根据角色关联的菜单，找出对应的权限
      const permissions = [];
      entity.menus
        .filter((menu) => menu.permissions)
        .forEach((menu) =>
          menu.permissions.forEach((permission) =>
            permissions.push(permission.name),
          ),
        );

      await manager.save(entity, {
        reload: false,
        transaction: false,
      });

      // 保存角色的权限信息到 Redis 集合
      await this.saveRolePermissionsToCache(entity.id, _.uniq(permissions));
    });
  }

  /**
   * 列表查询
   *
   */
  async list(
    findManyOptions?: FindManyOptions<SysRoleEntity>,
  ): Promise<Array<SysRoleVO>> {
    const list = await this.sysRoleRepository.find({
      ...findManyOptions,
      relations: ['menus'],
    });
    return plainToInstance(SysRoleVO, list);
  }

  /**
   * 删除
   *
   */
  async delete(roleId: number): Promise<void> {
    // Can not delete the role of admin
    if (roleId == 1)
      throw new ConflictException(
        this.i18n.t('error.DELETE_ROLE_FAILED', {
          lang: I18nContext.current().lang,
        }),
      );

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysRoleEntity, { id: roleId });

      // 删除 Redis 中对应的集合
      await this.deleteRolePermissionsInCache(roleId);
    });
  }

  /**
   * 删除 Redis 中角色的权限集合
   *
   */
  private async deleteRolePermissionsInCache(roleId: number) {
    await this.redisClient.del(SYS_ROLE_PERMISSION_KEY(roleId));
  }

  /**
   * 保存角色的权限到 Redis 集合中
   *
   */
  async saveRolePermissionsToCache(
    roleId: number,
    permNames: string[],
  ): Promise<void> {
    if (permNames.length == 0) return;

    // 使用 MULTI 删除旧集合 + 创建新集合
    const pipeline = this.redisClient.multi();
    pipeline.del(SYS_ROLE_PERMISSION_KEY(roleId));
    pipeline.sadd(SYS_ROLE_PERMISSION_KEY(roleId), permNames);
    await pipeline.exec();
  }

  /**
   * 判断角色是否具有某条权限
   *
   */
  async hasPermission(roleId: number, permission: string): Promise<number> {
    return await this.redisClient.sismember(
      SYS_ROLE_PERMISSION_KEY(roleId),
      permission,
    );
  }
}
