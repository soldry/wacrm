'use client';

import {
  IntlErrorCode,
  NextIntlClientProvider,
  type AbstractIntlMessages,
  type IntlError,
} from 'next-intl';
import type { ReactNode } from 'react';

/**
 * Client wrapper around NextIntlClientProvider.
 *
 * Root `layout.tsx` is a Server Component — it cannot pass function props
 * (`onError`, `getMessageFallback`) into a client provider. Those handlers
 * live here so missing translation keys stay soft warnings instead of
 * crashing the React tree (which often surfaces as a `removeChild`
 * NotFoundError).
 */
function handleIntlError(error: IntlError) {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(error.message);
    }
    return;
  }
  console.error(error);
}

export function AppIntlProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="UTC"
      onError={handleIntlError}
      getMessageFallback={({ key }) => key}
    >
      {children}
    </NextIntlClientProvider>
  );
}
