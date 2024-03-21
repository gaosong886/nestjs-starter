import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

/**
 * TypeORM 模块配置
 *
 */
export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    autoLoadEntities: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number | undefined>('database.port'),
    database: configService.get<string>('database.name'),
    username: configService.get<string>('database.user'),
    password: configService.get<string>('database.pass'),
    timezone: '-08:00',
    synchronize: false,
    logging: 'all',
  }),
  inject: [ConfigService],
};
