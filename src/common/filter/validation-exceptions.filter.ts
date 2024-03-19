import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import {
  I18nContext,
  I18nService,
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { ApiResponse } from '../model/api-response';

/**
 * 参数校验错误过滤器
 *
 */
@Catch(I18nValidationException)
export class ValidationExceptionsFilter extends I18nValidationExceptionFilter {
  constructor(i18n: I18nService) {
    super({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      responseBodyFormatter: (
        _host: ArgumentsHost,
        _exc: I18nValidationException,
        formattedErrors: object,
      ): Record<string, unknown> => {
        // 自定义格式化响应体
        return new ApiResponse(
          HttpStatus.BAD_REQUEST,
          i18n.t('error.VALIDATION_FAILED', {
            lang: I18nContext.current().lang,
          }),
          {
            errors: formattedErrors,
          },
        ) as unknown as Record<string, unknown>;
      },
    });
  }
}
