import {
  applyDecorators,
  UnsupportedMediaTypeException,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

/**
 * 自定义装饰器：封装 Multer 模块的常用参数
 * @param fieldName 上传请求中的文件字段名
 * @param options Multer 设置
 */
export function Upload(fieldName = 'file', options: MulterOptions = {}) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)));
}

/**
 * 自定义 Multer mimetype 过滤器
 * @param mimes 支持的文件类型列表
 * @returns 文件类型校验回调函数
 */
export function mimetypesfilter(...mimes: string[]) {
  return (
    _req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (mimes.some((mime) => file.mimetype.includes(mime))) {
      callback(null, true);
    } else {
      callback(
        new UnsupportedMediaTypeException('Unsupported file type'),
        false,
      );
    }
  };
}
