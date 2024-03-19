export const SYS_ROLE_PREFIX = 'SYS_ROLE';
export const SYS_ROLE_PERMISSION_KEY = (roleId: number) =>
  `${SYS_ROLE_PREFIX}:${roleId}:PERMISSION`;
