import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import NBANavbar from '@/components/navbar';
import { sfFont } from '@/styles/sfFont';
import { Bounce, ToastContainer } from 'react-toastify';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sfFont.variable}`} suppressHydrationWarning>
      <body>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <NBANavbar />
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
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
