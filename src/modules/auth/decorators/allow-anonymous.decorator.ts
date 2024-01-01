import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const ALLOW_ANONYMOUS_KEY = 'allowAnonymous';
export const AllowAnonymous = (): CustomDecorator<string> =>
  SetMetadata(ALLOW_ANONYMOUS_KEY, true);
