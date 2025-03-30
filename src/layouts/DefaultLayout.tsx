import Footer from '@components/layout/Footer/Footer';
import Navbar from '@components/layout/Navbar/Navbar';
import { FC, ReactNode } from 'react';

export const DefaultLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>{children}</main>
      <Footer />
    </>
  );
};
