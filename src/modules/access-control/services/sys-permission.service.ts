import { WinstonService } from '@gaosong886/nestjs-winston';
import { Injectable } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { AVOID_PERMISSION_KEY } from '../decorators/avoid-permission.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SysPermissionEntity } from '../entities/sys-permission.entity';
import { PaginationOutputDTO } from 'src/common/dtos/pagination-output.dto';
import { findUniqueElements } from 'src/common/utils/array.util';
import { PaginationInputDTO } from 'src/common/dtos/pagination-input.dto';
import { ALLOW_ANONYMOUS_KEY } from 'src/modules/auth/decorators/allow-anonymous.decorator';

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

  async onModuleInit() {
    await this.initPermissions();
  }

  async list(): Promise<Array<SysPermissionEntity>> {
    return await this.sysPermissionRepository.find({ order: { name: 'ASC' } });
  }

  async page(
    paginationInputDTO: PaginationInputDTO,
  ): Promise<PaginationOutputDTO<SysPermissionEntity>> {
    return await this.sysPermissionRepository.paginate(
      paginationInputDTO.page,
      paginationInputDTO.pageSize,
      {
        order: { name: 'ASC' },
      },
    );
  }

  async initPermissions() {
    // Get all controllers
    const controllers: InstanceWrapper[] =
      this.discoveryService.getControllers();
    const newPerms = [];

    controllers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;
      // Get the path metadata of the controller
      const controllerPath = this.reflector.get<string>(
        PATH_METADATA,
        instance.constructor,
      );
      // Get all method names of the controller
      const methodNames = this.metadataScanner.getAllMethodNames(instance);

      methodNames.forEach((name) => {
        // Check if the permission should be ignored
        if (this.reflector.get<boolean>(AVOID_PERMISSION_KEY, instance[name]))
          return;
        if (this.reflector.get<boolean>(ALLOW_ANONYMOUS_KEY, instance[name]))
          return;

        const e = new SysPermissionEntity();
        e.name = `${controllerPath}:${name}`;
        newPerms.push(e);
      });
    });

    await this.dataSource.transaction(async (manager) => {
      // Find all existing permissions in database
      const oldPerms = await this.sysPermissionRepository.find();

      // Find the unique elements in both two arrays.
      // Then we cant get the elements that need to be saved or removed respectively.
      const uniqueElements = findUniqueElements<SysPermissionEntity>(
        newPerms,
        oldPerms,
        (e) => e.name,
      );

      // If there are no permissions to save or remove, return
      if (uniqueElements.first.length == 0 && uniqueElements.second.length == 0)
        return;

      // If there are permissions to add, save them
      if (uniqueElements.first.length > 0)
        await manager.save(uniqueElements.first);

      // If there are permissions to delete, remove them
      // ??? 'manager.remove' will cause the second array become '[{}]' ??
      if (uniqueElements.second.length > 0)
        await manager.remove(uniqueElements.second);
    });
  }
}
