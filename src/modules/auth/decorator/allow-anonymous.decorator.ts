import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const ALLOW_ANONYMOUS_KEY = 'allowAnonymous';

/**
 * 自定义装饰器：允许匿名访问
 */
export const AllowAnonymous = (): CustomDecorator<string> =>
  SetMetadata(ALLOW_ANONYMOUS_KEY, true);
