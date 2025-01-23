import '@/styles/globals.css';

import { Providers } from '@/app/providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
