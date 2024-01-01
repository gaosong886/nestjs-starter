import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const AVOID_PERMISSION_KEY = 'avoidPermission';
export const AvoidPermission = (): CustomDecorator<string> =>
  SetMetadata(AVOID_PERMISSION_KEY, true);
