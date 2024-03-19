// throttler-behind-proxy.guard.ts
import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

/**
 * Throttler 限流守卫
 */
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  // 当服务在反向代理后面，要重写 getTracker 方法告诉 Throttler 如何获取请求的真实 IP
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}
