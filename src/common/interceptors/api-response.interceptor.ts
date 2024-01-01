import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponseDTO } from '../dtos/api-response.dto';
import { ERROR_CODE } from '../constants/error-code.constant';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDTO<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDTO<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: ERROR_CODE.SUCCESS,
          data: data,
        };
      }),
    );
  }
}
