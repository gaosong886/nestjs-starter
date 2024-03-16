import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { STRATEGY_JWT_AUTH } from '../constants';
import { Reflector } from '@nestjs/core';
import { ALLOW_ANONYMOUS_KEY } from '../decorators/allow-anonymous.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // If there is a @AllowAnonymous decorator, let go
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
