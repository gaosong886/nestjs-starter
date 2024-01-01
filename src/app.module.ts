import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleOptions } from './config/module-options/config-module-options';
import { AuthModule } from './modules/auth/auth.module';
import { winstonModuleAsyncOptions } from './config/module-options/winston-module-async-options';
import { SysUserModule } from './modules/sys-user/sys-user.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  Reflector,
} from '@nestjs/core';
import { HttpExceptionsFilter } from './common/filters/http-exceptions.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { I18nModule, I18nValidationPipe } from 'nestjs-i18n';
import { ValidationExceptionsFilter } from './common/filters/validation-exceptions.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleAsyncOptions } from './config/module-options/typeorm-module-async-options';
import { ThrottlerBehindProxyGuard } from './common/guards/throttler-behind-proxy.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { i18nMoudleOptions } from './config/module-options/i18n-module-options';
import { throttlerModuleOptions } from './config/module-options/throttler-module-options';
import { WinstonModule } from '@gaosong886/nestjs-winston';
import { RedisModule } from '@gaosong886/nestjs-redis';
import { redisModuleAsyncOptions } from './config/module-options/redis-module-async-options';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { ErrorsFilter } from './common/filters/errors.filter';
import { PermissionGuard } from './modules/access-control/guards/permission.guard';
import { RequestLoggingInterceptor } from './modules/access-control/interceptors/request-logging.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTaskModule } from './modules/scheduled-task/scheduled-task.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot(configModuleOptions),

    // ORM
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),

    // Redis
    RedisModule.forRootAsync(redisModuleAsyncOptions),

    // Logger
    WinstonModule.forRootAsync(winstonModuleAsyncOptions),

    // Internationalization support
    I18nModule.forRoot(i18nMoudleOptions),

    // Rate limiting
    ThrottlerModule.forRoot(throttlerModuleOptions),

    // Scheduling
    ScheduleModule.forRoot(),

    // This is a local static file solution for dev
    // The production environment should use a dedicated web server, such as nginx
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return [
          {
            rootPath: configService.get<string>('fileUploadDir'),
            serveRoot: configService.get<string>('fileServeRoot'),
          },
        ];
      },
      inject: [ConfigService],
    }),

    SysUserModule,
    AuthModule,
    AccessControlModule,
    ScheduledTaskModule,
  ],

  providers: [
    // Rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },

    // Jwt Authentication
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Access control
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },

    // Serializes responses
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector, {
          /* May put some configs here */
          exposeUnsetFields: false,
        }),
      inject: [Reflector],
    },

    // Interceptor for formatting response data
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },

    // Interceptor for logging
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },

    // Filter for commmon error
    {
      provide: APP_FILTER,
      useClass: ErrorsFilter,
    },

    // Filter for http exception
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },

    // Filter for validation error
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionsFilter,
    },

    // A global validation pipe with internationalization support
    // see https://github.com/toonvanstrijp/nestjs-i18n
    {
      provide: APP_PIPE,
      useFactory: () =>
        new I18nValidationPipe({ transform: true, whitelist: true }),
    },
  ],
})
export class AppModule {}
