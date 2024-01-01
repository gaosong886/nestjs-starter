import {
  WinstonModuleAsyncOptions,
  WinstonModuleOptions,
} from '@gaosong886/nestjs-winston';
import { ConfigService } from '@nestjs/config';

import { format, transports } from 'winston';
import 'winston-daily-rotate-file'; // Expand winston.transports with adding 'DailyRotateFile'

export const winstonModuleAsyncOptions: WinstonModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async (
    configService: ConfigService,
  ): Promise<WinstonModuleOptions> => {
    const { combine, label, timestamp, printf } = format;
    const isProd = configService.get<string>('env') == 'production';

    // Create a transport for the app log
    const appTransport = new transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }).setMaxListeners(0); // To indicate an unlimited number of listeners

    // Create a transport for the error log
    const errorTransport = new transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }).setMaxListeners(0);

    const options: WinstonModuleOptions = {
      // Set the log level to warn in production, debug in development
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

    // If the environment is development, add a console transport
    if (!isProd)
      (options.transports as any[]).push(
        new transports.Console().setMaxListeners(0),
      );
    return options;
  },
  inject: [ConfigService],
};
