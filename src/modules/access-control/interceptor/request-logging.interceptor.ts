import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { SysLogService } from '../service/sys-log.service';

/**
 * 拦截器，用于记录操作日志
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private sysLogService: SysLogService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    if (req.user) {
      const ip = req.ips.length ? req.ips[0] : req.ip;
      await this.sysLogService.save(
        req.user.id,
        ip,
        req.url,
        JSON.stringify(req.body),
      );
    }

    return next.handle();
  }
}
