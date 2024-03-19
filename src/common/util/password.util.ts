import * as bcrypt from 'bcryptjs';

/**
 * 获取密码哈希
 *
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

/**
 * 校验哈希密码
 *
 */
export const checkPassword = async (
  inputPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};
