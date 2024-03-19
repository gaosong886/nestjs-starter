import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { ERROR_CODE } from '../constant/error-code.constant';

/**
 * 全局格式化响应体
 *
 */
@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
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
