import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'คณะเทคโนโลยีอุตสาหกรรม - มหาวิทยาลัยนครพนม',
  description: 'ทำเนียบบุคลากร คณะผู้บริหาร คณาจารย์ และบุคลากรสายสนับสนุน คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยนครพนม',
  icons: {
    icon: '/img/โลโก้.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between text-slate-800 antialiased selection:bg-sky-500 selection:text-white bg-[#e0f2fe]">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
