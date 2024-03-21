import { Expose } from 'class-transformer';

/**
 * 通用响应体封装
 */
export class ApiResponse<T> {
  @Expose()
  code: number;

  @Expose()
  message?: string;

  @Expose()
  data?: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
