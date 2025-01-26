import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import NBANavbar from '@/components/navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <NBANavbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
