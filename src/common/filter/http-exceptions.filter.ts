import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '../model/api-response';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ThrottlerException } from '@nestjs/throttler';
import { WinstonService } from '@gaosong886/nestjs-winston';

/**
 * HTTP 错误过滤器
 *
 */
@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(
    private winstonService: WinstonService,
    private i18n: I18nService,
  ) {
    this.winstonService.setContext(HttpExceptionsFilter.name);
  }

  catch(exception: HttpException, host: ArgumentsHost): any {
    const res: Response = host.switchToHttp().getResponse<Response>();

    const statusCode = exception.getStatus();
    let message = exception.message;

    // 隐藏 HTTP500 的错误堆栈信息
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = this.i18n.t('error.INTERNAL_SERVER_ERROR', {
        lang: I18nContext.current().lang,
      });
      this.winstonService.error(
        `${JSON.stringify(exception)}\n${exception.stack}`,
      );
      // 限流模块的异常
    } else if (exception instanceof ThrottlerException) {
      message = this.i18n.t('error.TOO_MANY_REQUESTS', {
        lang: I18nContext.current().lang,
      });
    }

    res.status(statusCode).json(new ApiResponse(statusCode, message));
  }
}
