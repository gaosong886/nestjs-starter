import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AVOID_PERMISSION_KEY } from '../decorator/avoid-permission.decorator';
import { PATH_METADATA } from '@nestjs/common/constants';
import { SysRoleService } from '../service/sys-role.service';
import { Request } from 'express';
import { WinstonService } from '@gaosong886/nestjs-winston';
import { ALLOW_ANONYMOUS_KEY } from 'src/modules/auth/decorator/allow-anonymous.decorator';

/**
 * 权限守卫
 *
 */
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
    // 带有 @AllowAnonymous 装饰器的路径，直接放行
    if (this.reflector.get<boolean>(ALLOW_ANONYMOUS_KEY, context.getHandler()))
      return true;

    // 带有 @AvoidPermission 装饰器的路径，直接放行
    if (this.reflector.get<boolean>(AVOID_PERMISSION_KEY, context.getHandler()))
      return true;

    const req: Request = context.switchToHttp().getRequest();

    if (req.user && req.user.roles) {
      const roles = req.user.roles;

      // 获得当前路径的权限字符串
      const permissionString = this.getPermissionString(context);

      for (let i = 0; i < roles.length; i++) {
        // 管理员角色，直接放行
        if (roles[i].id === 1) return true;

        // 去 Redis 的角色权限集合中查看当前角色是否具有该路径权限
        const res = await this.sysRoleService.hasPermission(
          roles[i].id,
          permissionString,
        );
        if (res == 1) return true;
      }
    }

    return false;
  }

  // 拼装权限字符串，例如 sys-user:update
  getPermissionString(context: ExecutionContext): string {
    const controllerPath = this.reflector.get<string>(
      PATH_METADATA,
      context.getClass().prototype.constructor,
    );
    return `${controllerPath}:${context.getHandler().name}`;
  }
}
