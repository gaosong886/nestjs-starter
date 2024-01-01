import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    autoLoadEntities: true,
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number | undefined>('database.port'),
    database: configService.get<string>('database.name'),
    username: configService.get<string>('database.user'),
    password: configService.get<string>('database.pass'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    timezone: '-08:00',
    synchronize: false,
  }),
  inject: [ConfigService],
};
