import { ConflictException, Injectable } from '@nestjs/common';
import { SysRoleEntity } from '../entities/sys-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, In, Repository } from 'typeorm';
import { WinstonService } from '@gaosong886/nestjs-winston';
import { PaginationOutputDTO } from 'src/common/dtos/pagination-output.dto';
import { InjectRedis, RedisClient } from '@gaosong886/nestjs-redis';
import { SYS_ROLE_PERMISSION_KEY } from '../constants/redis-keys.constant';
import { SysRoleInputDTO } from '../dtos/sys-role-input.dto';
import { PaginationInputDTO } from 'src/common/dtos/pagination-input.dto';
import { SysMenuEntity } from '../entities/sys-menu.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';
import _ from 'lodash';

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

  async create(sysRoleInputDTO: SysRoleInputDTO): Promise<SysRoleEntity> {
    const entity = new SysRoleEntity();
    entity.name = sysRoleInputDTO.name;
    entity.description = sysRoleInputDTO.description;
    entity.menus = await this.sysMenuRepository.find({
      where: { id: In(_.uniq(sysRoleInputDTO.menuIds)) },
      relations: ['permissions'],
    });

    const permissions = [];
    entity.menus
      .filter((menu) => menu.permissions)
      .forEach((menu) =>
        menu.permissions.forEach((permission) =>
          permissions.push(permission.name),
        ),
      );

    // Start a transaction
    await this.dataSource.transaction(async (manager) => {
      await manager.save(entity);
      await this.storeRolePermissionsInCache(entity.id, _.uniq(permissions));
    });
    return entity;
  }

  async update(id: number, sysRoleInputDTO: SysRoleInputDTO): Promise<void> {
    // Start a transaction
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
        // Administrator takes all permissions
      });

      const permissions = [];
      entity.menus
        .filter((menu) => menu.permissions)
        .forEach((menu) =>
          menu.permissions.forEach((permission) =>
            permissions.push(permission.name),
          ),
        );

      await manager.save(entity);
      await this.storeRolePermissionsInCache(entity.id, _.uniq(permissions));
    });
  }

  async page(
    paginationInputDTO: PaginationInputDTO,
    findManyOptions?: FindManyOptions<SysRoleEntity>,
  ): Promise<PaginationOutputDTO<SysRoleEntity>> {
    return await this.sysRoleRepository.paginate(
      paginationInputDTO.page,
      paginationInputDTO.pageSize,
      {
        ...findManyOptions,
        relations: ['menus'],
      },
    );
  }

  async list(
    findManyOptions?: FindManyOptions<SysRoleEntity>,
  ): Promise<Array<SysRoleEntity>> {
    return await this.sysRoleRepository.find({
      ...findManyOptions,
      relations: ['menus'],
    });
  }

  async delete(roleId: number) {
    if (roleId == 1)
      throw new ConflictException(
        this.i18n.t('error.DELETE_ROLE_FAILED', {
          lang: I18nContext.current().lang,
        }),
      );

    // Start a transaction
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SysRoleEntity, { id: roleId });
      await this.deleteRolePermissionsInCache(roleId);
    });
  }

  async deleteRolePermissionsInCache(roleId: number) {
    await this.redisClient.del(SYS_ROLE_PERMISSION_KEY(roleId));
  }

  async storeRolePermissionsInCache(
    roleId: number,
    permNames: string[],
  ): Promise<void> {
    if (permNames.length == 0) return;
    const pipeline = this.redisClient.multi();
    pipeline.del(SYS_ROLE_PERMISSION_KEY(roleId));
    pipeline.sadd(SYS_ROLE_PERMISSION_KEY(roleId), permNames);
    await pipeline.exec();
  }

  async retrieveRolePermissionsFromCache(roleId: number): Promise<string[]> {
    return await this.redisClient.smembers(SYS_ROLE_PERMISSION_KEY(roleId));
  }
}
