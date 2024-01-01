import { RedisModuleAsyncOptions } from '@gaosong886/nestjs-redis';
import { ConfigService } from '@nestjs/config';

export const redisModuleAsyncOptions: RedisModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    return {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      db: configService.get<number>('redis.db'),
    };
  },
  inject: [ConfigService],
};
