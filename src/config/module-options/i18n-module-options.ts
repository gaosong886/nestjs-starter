import { AcceptLanguageResolver, I18nOptions } from 'nestjs-i18n';
import * as path from 'path';

export const i18nMoudleOptions: I18nOptions = {
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '../../i18n/'), // dist/i18n
    watch: true,
  },
  resolvers: [new AcceptLanguageResolver()],
};
