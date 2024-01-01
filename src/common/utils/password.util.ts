import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (
  inputPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};
