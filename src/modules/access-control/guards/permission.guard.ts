import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AVOID_PERMISSION_KEY } from '../decorators/avoid-permission.decorator';
import { PATH_METADATA } from '@nestjs/common/constants';
import { SysRoleService } from '../services/sys-role.service';
import { Request } from 'express';
import { WinstonService } from '@gaosong886/nestjs-winston';
import { ALLOW_ANONYMOUS_KEY } from 'src/modules/auth/decorators/allow-anonymous.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sysRoleService: SysRoleService,
    private winstonService: WinstonService,
  ) {
    this.winstonService.setContext(PermissionGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.get<boolean>(ALLOW_ANONYMOUS_KEY, context.getHandler()))
      return true;

    if (this.reflector.get<boolean>(AVOID_PERMISSION_KEY, context.getHandler()))
      return true;

    const req: Request = context.switchToHttp().getRequest();

    if (req.user && req.user.roles) {
      const roles = req.user.roles;

      // Get the permission string of current path
      const permissionString = this.getPermissionString(context);

      for (let i = 0; i < roles.length; i++) {
        // Administrator can do everything
        if (roles[i].id === 1) return true;

        // Get permissions from redis by role id
        const permissions =
          await this.sysRoleService.retrieveRolePermissionsFromCache(
            roles[i].id,
          );

        // Check if there is permission to access the current path
        if (permissions.includes(permissionString)) return true;
      }
    }

    return false;
  }

  getPermissionString(context: ExecutionContext): string {
    const controllerPath = this.reflector.get<string>(
      PATH_METADATA,
      context.getClass().prototype.constructor,
    );
    return `${controllerPath}:${context.getHandler().name}`;
  }
}
