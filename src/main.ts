import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // 使用 Express 实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Throttler 相关设置
  // 这里将 'trust proxy' 的值设置为当前应用程序前面的反向代理数量
  // 例如，如果它前面有一个Nginx，则使用 'app.set('trust proxy', 1)'
  // 参考 https://docs.nestjs.com/security/rate-limiting#proxies
  app.set('trust proxy', 1);

  app.enableCors({
    origin: '*',
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  // 路由前缀设置
  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>('apiRoot');
  if (globalPrefix) app.setGlobalPrefix(globalPrefix);

  await app.listen(configService.get<number>('serverPort'));
}

bootstrap();
