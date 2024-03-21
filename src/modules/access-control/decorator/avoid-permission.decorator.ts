import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const AVOID_PERMISSION_KEY = 'avoidPermission';

/**
 * 自定义装饰器：跳过权限检查
 */
export const AvoidPermission = (): CustomDecorator<string> =>
  SetMetadata(AVOID_PERMISSION_KEY, true);
