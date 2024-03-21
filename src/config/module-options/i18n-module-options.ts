import { AcceptLanguageResolver, I18nOptions } from 'nestjs-i18n';
import * as path from 'path';

/**
 * 多语言模块配置
 */
export const i18nMoudleOptions: I18nOptions = {
  // 如果没有对应本地化文本，默认语言为 en
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '../../i18n/'), // dist/i18n
    watch: true,
  },

  // 语言环境识别器：从 Accept-Language 头获取
  resolvers: [new AcceptLanguageResolver()],
};
