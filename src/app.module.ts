import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleOptions } from './config/module-options/config-module-options';
import { AuthModule } from './modules/auth/auth.module';
import { winstonModuleAsyncOptions } from './config/module-options/winston-module-async-options';
import { SysUserModule } from './modules/sys-user/sys-user.module';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  Reflector,
} from '@nestjs/core';
import { HttpExceptionsFilter } from './common/filter/http-exceptions.filter';
import { ApiResponseInterceptor } from './common/interceptor/api-response.interceptor';
import { I18nModule, I18nValidationPipe } from 'nestjs-i18n';
import { ValidationExceptionsFilter } from './common/filter/validation-exceptions.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleAsyncOptions } from './config/module-options/typeorm-module-async-options';
import { ThrottlerBehindProxyGuard } from './common/guard/throttler-behind-proxy.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { i18nMoudleOptions } from './config/module-options/i18n-module-options';
import { throttlerModuleOptions } from './config/module-options/throttler-module-options';
import { WinstonModule } from '@gaosong886/nestjs-winston';
import { RedisModule } from '@gaosong886/nestjs-redis';
import { redisModuleAsyncOptions } from './config/module-options/redis-module-async-options';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { ErrorsFilter } from './common/filter/errors.filter';
import { PermissionGuard } from './modules/access-control/guard/permission.guard';
import { RequestLoggingInterceptor } from './modules/access-control/interceptor/request-logging.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTaskModule } from './modules/scheduled-task/scheduled-task.module';

@Module({
  imports: [
    // 配置项
    ConfigModule.forRoot(configModuleOptions),

    // ORM
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),

    // Redis
    RedisModule.forRootAsync(redisModuleAsyncOptions),

    // 日志
    WinstonModule.forRootAsync(winstonModuleAsyncOptions),

    // 多语言支持
    I18nModule.forRoot(i18nMoudleOptions),

    // 限流
    ThrottlerModule.forRoot(throttlerModuleOptions),

    // 定时任务
    ScheduleModule.forRoot(),

    // 这是一个用于开发调试的本地静态文件解决方案
    // 生产环境应该使用专用的 Web 服务器，例如 nginx
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

    // 用户模块
    SysUserModule,

    // 认证模块
    AuthModule,

    // 路由权限控制模块
    AccessControlModule,

    // 定时任务模块
    ScheduledTaskModule,
  ],

  providers: [
    // 访问限流守卫
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },

    // Jwt 守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // 鉴权守卫
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },

    // 格式化响应体拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },

    // 序列化响应体拦截器
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector, {
          exposeUnsetFields: false,
          excludeExtraneousValues: true,
        }),
      inject: [Reflector],
    },

    // 操作日志拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },

    // 内部错误过滤器
    {
      provide: APP_FILTER,
      useClass: ErrorsFilter,
    },

    // HTTP 异常过滤器
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },

    // 参数校验错误过滤器
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionsFilter,
    },

    // 参数校验错误信息管道，提供错误信息的多语言支持
    // 参考 https://github.com/toonvanstrijp/nestjs-i18n
    {
      provide: APP_PIPE,
      useFactory: () =>
        new I18nValidationPipe({ transform: true, whitelist: true }),
    },
  ],
})
export class AppModule {}
