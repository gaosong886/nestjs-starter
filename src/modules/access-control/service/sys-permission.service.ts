import { WinstonService } from '@gaosong886/nestjs-winston';
import { Injectable } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { AVOID_PERMISSION_KEY } from '../decorator/avoid-permission.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SysPermissionEntity } from '../model/entity/sys-permission.entity';
import { findUniqueElements } from 'src/common/util/array.util';
import { ALLOW_ANONYMOUS_KEY } from 'src/modules/auth/decorator/allow-anonymous.decorator';
import { plainToInstance } from 'class-transformer';
import { SysPermissionVO } from '../model/vo/sys-permission.vo';

@Injectable()
export class SysPermissionService {
  constructor(
    private discoveryService: DiscoveryService,
    private winstonService: WinstonService,
    private metadataScanner: MetadataScanner,
    private reflector: Reflector,
    @InjectRepository(SysPermissionEntity)
    private sysPermissionRepository: Repository<SysPermissionEntity>,
    private dataSource: DataSource,
  ) {
    this.winstonService.setContext(SysPermissionService.name);
  }

  /**
   * 模块加载时，初始化权限字符串并和数据库进行比对
   */
  async onModuleInit() {
    await this.initPermissions();
  }

  /**
   * 列表查询
   * @return Promise<Array<SysPermissionVO>> 权限列表
   */
  async list(): Promise<Array<SysPermissionVO>> {
    const list = await this.sysPermissionRepository.find({
      order: { name: 'ASC' },
    });
    return plainToInstance(SysPermissionVO, list);
  }

  /**
   * 初始化权限字符串并和数据库进行比对
   */
  async initPermissions() {
    // 获取所有控制器
    const controllers: InstanceWrapper[] =
      this.discoveryService.getControllers();

    // 本地权限数组
    const newPerms = [];

    controllers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      // 获取控制器的 Mapping 路径
      const controllerPath = this.reflector.get<string>(
        PATH_METADATA,
        instance.constructor,
      );
      // 获取控制器的所有方法
      const methodNames = this.metadataScanner.getAllMethodNames(instance);

      methodNames.forEach((name) => {
        // 查看方法上的装饰器，看是否不需要权限
        if (this.reflector.get<boolean>(AVOID_PERMISSION_KEY, instance[name]))
          return;
        if (this.reflector.get<boolean>(ALLOW_ANONYMOUS_KEY, instance[name]))
          return;

        // 拼装权限字符串，创建实体类，放入本地数组
        const e = new SysPermissionEntity();
        e.name = `${controllerPath}:${name}`;
        newPerms.push(e);
      });
    });

    await this.dataSource.transaction(async (manager) => {
      // 数据库中的权限数组
      const oldPerms = await this.sysPermissionRepository.find();

      // 找出本地数组和数据库数组中不重合的部分，它们分别是待插入和待删除的实体
      const uniqueElements = findUniqueElements<SysPermissionEntity>(
        newPerms,
        oldPerms,
        (e) => e.name,
      );

      if (uniqueElements.first.length == 0 && uniqueElements.second.length == 0)
        return;

      if (uniqueElements.first.length > 0)
        await manager.save(uniqueElements.first, {
          reload: false,
          transaction: false,
        });

      if (uniqueElements.second.length > 0)
        await manager.remove(uniqueElements.second);
    });
  }
}
