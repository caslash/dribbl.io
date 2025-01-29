import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import NBANavbar from '@/components/navbar';
import { Toaster } from 'react-hot-toast';
import { sfFont } from '@/styles/sfFont';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sfFont.variable}`} suppressHydrationWarning>
      <body>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <NBANavbar />
          <Toaster position="bottom-center" />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
