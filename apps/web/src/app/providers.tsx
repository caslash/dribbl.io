'use client';

import { DBUserProvider } from '@/context/dbusercontext';
import type { ThemeProviderProps } from 'next-themes';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

export interface ProvidersProps {
  children: ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <DBUserProvider>{children}</DBUserProvider>
    </NextThemesProvider>
  );
}
