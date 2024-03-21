import { ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * 限流模块配置
 */
export const throttlerModuleOptions: ThrottlerModuleOptions = [
  // 每秒 3 次请求
  {
    name: 'short',
    ttl: 1000,
    limit: 3,
  },

  // 每10 秒 20 次请求
  {
    name: 'medium',
    ttl: 10000,
    limit: 20,
  },

  // 每分钟 100 次请求
  {
    name: 'long',
    ttl: 60000,
    limit: 100,
  },
];
