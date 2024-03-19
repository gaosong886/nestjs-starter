import {
  WinstonModuleAsyncOptions,
  WinstonModuleOptions,
} from '@gaosong886/nestjs-winston';
import { ConfigService } from '@nestjs/config';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file'; // Expand winston.transports with adding 'DailyRotateFile'

/**
 * Winston 日志模块配置
 *
 */
export const winstonModuleAsyncOptions: WinstonModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async (
    configService: ConfigService,
  ): Promise<WinstonModuleOptions> => {
    const { combine, label, timestamp, printf } = format;
    const isProd = configService.get<string>('env') == 'production';

    // App Log
    const appTransport = new transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }).setMaxListeners(0); // 这里如果不设置会报错，副作用待考

    // Error Log
    const errorTransport = new transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }).setMaxListeners(0);

    const options: WinstonModuleOptions = {
      // 生产环境日志级别为 warn, 开发环境为 debug
      level: isProd ? 'warn' : 'debug',
      format: combine(
        label({ label: configService.get<string>('appName') }),
        timestamp({ format: 'YYYY/MM/DD hh:mm:ss' }),
        printf(({ label, pid, timestamp, level, message, context }) => {
          return `[${label}] ${pid} - ${timestamp} ${level} [${context}] ${message}`;
        }),
      ),
      transports: [appTransport, errorTransport],
    };

    // 测试环境开启 console 日志
    if (!isProd)
      (options.transports as any[]).push(
        new transports.Console().setMaxListeners(0),
      );
    return options;
  },
  inject: [ConfigService],
};
