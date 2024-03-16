import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { extendRepositoryWithPagination } from './common/utils/pagination.util';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // see https://docs.nestjs.com/security/rate-limiting#proxies
  // Set the value of ‘trust proxy’ to the number of reverse proxies in front of the current application.
  // For example, if there is one Nginx in front of it, use "app.set('trust proxy', 1)";
  app.set('trust proxy', 1);

  app.enableCors({
    origin: '*',
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  const configService = app.get(ConfigService);
  const globalPrefix = configService.get<string>('apiRoot');
  if (globalPrefix) app.setGlobalPrefix(globalPrefix);

  await app.listen(configService.get<number>('serverPort'));
}
// Add a pagination method to typeorm repository
extendRepositoryWithPagination();
bootstrap();
