import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import NBANavbar from '@/components/navbar/navbar';
import { sfFont } from '@/styles/sfFont';
import { ReactNode } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${sfFont.variable}`} suppressHydrationWarning>
      <body>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <nav className="fixed top-0 left-0 w-full z-10 flex justify-center z-[100] pointer-events-auto">
            <NBANavbar className="w-auto top-8" />
          </nav>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar
            closeOnClick
            newestOnTop
            pauseOnHover
            closeButton={false}
            transition={Bounce}
          />
          <main>
            <div className="h-dvh w-full p-16">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
