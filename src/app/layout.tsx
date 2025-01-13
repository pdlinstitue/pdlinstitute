import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
// import Providers from '../../redux/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PDL INSTITUTE',
  description: 'Self-Development Training',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster toastOptions={{ style:
          { 
            background: "white", 
            color:"orrange", 
            border:"1.5px solid orrange", 
            borderRadius:"10px",
            padding:"6px", 
            width: "auto", 
            textAlign: "center"
          }}}
        />
        {children}
      </body>
    </html>  
  );
}
