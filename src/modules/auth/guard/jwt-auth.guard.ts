import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { STRATEGY_JWT_AUTH } from '../constant';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANONYMOUS_KEY } from '../decorator/allow-anonymous.decorator';

/**
 * Jwt 鉴权守卫
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 如果当前路由方法有 @AllowAnonymous 装饰器, 放行
    const skip: boolean = this.reflector.get<boolean>(
      ALLOW_ANONYMOUS_KEY,
      context.getHandler(),
    );
    if (skip) return true;

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) throw err || new UnauthorizedException(`${info}`);
    return user;
  }
}
