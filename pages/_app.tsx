import { BackNotificationsProvider } from '@hooks/useBackNotifications';
import { LocaleProvider } from '@hooks/useLocale';
import { UserProvider } from '@hooks/useUser';
import { WidthProvider } from '@hooks/useWidth';
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates';
import '@styles/globals.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import 'dayjs/locale/ru';
import { useRouter } from 'next/router';
import styles from '@styles/spinner.module.css';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (_: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const theme = createTheme({
  colors: {
    white: ['#ffffff'],
    'old-accept': ['#87ceeb'],
    future: ['#f880fe'],
  },
});

function Accept({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleEnd = () => setLoading(false);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleEnd);
    router.events.on('routeChangeError', handleEnd);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleEnd);
      router.events.off('routeChangeError', handleEnd);
    };
  }, [router]);

  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: 'ru' }}>
        <WidthProvider>
          <LocaleProvider>
            <UserProvider>
              <Notifications
                position="bottom-left"
                zIndex={9999}
                limit={5}
                autoClose={40000}
              />
              <BackNotificationsProvider>
                <div
                  className={`${styles.spinner} ${
                    loading ? styles.active : ''
                  }`}
                />
                {getLayout(<Component {...pageProps} />)}
              </BackNotificationsProvider>
            </UserProvider>
          </LocaleProvider>
        </WidthProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

export default Accept;
