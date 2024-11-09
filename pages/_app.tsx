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
import {
  ActionIcon,
  Badge,
  colorsTuple,
  createTheme,
  MantineProvider,
  rem,
} from '@mantine/core';
import 'dayjs/locale/ru';
import { useRouter } from 'next/router';
import styles from '@styles/spinner.module.css';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/code-highlight/styles.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (_: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const theme = createTheme({
  primaryColor: 'primary',
  // scale: 1 / (12 / 16),
  fontSizes: {
    xs: '0.8rem',
    sm: '1rem',
    md: '1.2rem',
    lg: '1.4rem',
    xl: '1.7rem',
  },
  components: {
    Badge: Badge.extend({
      defaultProps: {
        variant: 'outline',
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        style: { backgroundColor: 'transparent' },
      },
    }),
  },
  colors: {
    primary: [
      '#e1f8ff',
      '#cdecff',
      '#9ed6fc',
      '#6bbff7',
      '#41acf3',
      '#259ff1',
      '#0c99f2',
      '#0085d8',
      '#0076c3',
      '#0066ad',
    ],
    white: colorsTuple('#ffffff'),
    'old-accept': colorsTuple('#87ceeb'),
    future: colorsTuple('#f880fe'),
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
