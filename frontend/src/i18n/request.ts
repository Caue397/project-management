import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

const SUPPORTED = ['pt', 'en', 'es'] as const;
type Locale = (typeof SUPPORTED)[number];

export default getRequestConfig(async () => {
  const store = await cookies();
  const raw = store.get('NEXT_LOCALE')?.value;
  const locale: Locale = SUPPORTED.includes(raw as Locale) ? (raw as Locale) : 'pt';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
