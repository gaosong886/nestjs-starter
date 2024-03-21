import configuration from '../configuration';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import Joi from '@hapi/joi';

/**
 * ConfigModule 配置
 */
export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  cache: true,
  envFilePath: ['.env'],
  load: [configuration],

  // 配置文件输入校验
  validationSchema: Joi.object({
    APP_NAME: Joi.string(),
    SERVER_PORT: Joi.number().required(),
    API_ROOT: Joi.string().optional(),
    FILE_SERVE_ROOT: Joi.string().required(),
    FILE_UPLOAD_DIR: Joi.string().required(),
    FILE_BASE_URL: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().optional(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_DB: Joi.number().required(),
    JWT_PUBLIC_KEY_BASE64: Joi.string().required(),
    JWT_PRIVATE_KEY_BASE64: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXP_IN_SEC: Joi.number().required(),
    JWT_REFRESH_TOKEN_EXP_IN_SEC: Joi.number().required(),
  }),
  validationOptions: {
    // 允许未定义字段
    allowUnknown: true,
  },
};
