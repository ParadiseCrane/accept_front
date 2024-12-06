'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import Navbar from '@components/layout/Navbar/Navbar';
import Footer from '@components/layout/Footer/Footer';
import { getCookie } from 'cookies-next';
import { LegacyRedirect } from './LegacyRedirect';

export const DefaultLayout: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const [skipRedirect, _] = useState(
    getCookie('skip')?.toString() ?? ''
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <>
      {skipRedirect ? (
        <>
          <Navbar />
          <main style={{ minHeight: '100vh' }}>{children}</main>
          <Footer />
        </>
      ) : (
        <LegacyRedirect />
      )}
    </>
  ) : (
    <></>
  );
};
