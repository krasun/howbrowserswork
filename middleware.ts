import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // This means no prefix for default locale (en)
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|es)/:path*'],
};

