'use client';

import type { ThemeProviderProps } from 'next-themes';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { HeroUIProvider } from '@heroui/system';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const useHref = (href: string) => process.env.BASE_PATH + href;

  return (
    <HeroUIProvider navigate={router.push} useHref={useHref}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}
