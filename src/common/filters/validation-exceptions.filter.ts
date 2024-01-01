import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import {
  I18nContext,
  I18nService,
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { ApiResponseDTO } from '../dtos/api-response.dto';

@Catch(I18nValidationException)
export class ValidationExceptionsFilter extends I18nValidationExceptionFilter {
  constructor(i18n: I18nService) {
    super({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      // Format response body to common api response of the project
      responseBodyFormatter: (
        _host: ArgumentsHost,
        _exc: I18nValidationException,
        formattedErrors: object,
      ): Record<string, unknown> => {
        return new ApiResponseDTO(
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
