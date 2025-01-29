import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import NBANavbar from '@/components/navbar';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <NBANavbar />
          <Toaster position="top-center" />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
