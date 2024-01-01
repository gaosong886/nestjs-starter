import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponseDTO } from '../dtos/api-response.dto';
import { Response } from 'express';
import { WinstonService } from '@gaosong886/nestjs-winston';

@Catch(Error)
export class ErrorsFilter implements ExceptionFilter {
  constructor(private winstonService: WinstonService) {
    this.winstonService.setContext(ErrorsFilter.name);
  }

  catch(exception: Error, host: ArgumentsHost): any {
    const res: Response = host.switchToHttp().getResponse<Response>();

    this.winstonService.error(
      `${JSON.stringify(exception)}\n${exception.stack}`,
    );

    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new ApiResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, exception.message),
      );
  }
}
