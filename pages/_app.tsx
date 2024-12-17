import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/code-highlight/styles.css';
import '@styles/globals.css';
import '@styles/tiptap.css';
import { BackNotificationsProvider } from '@hooks/useBackNotifications';
import { LocaleProvider } from '@hooks/useLocale';
import { UserProvider } from '@hooks/useUser';
import { WidthProvider } from '@hooks/useWidth';
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import {
  ActionIcon,
  Badge,
  colorsTuple,
  createTheme,
  em,
  MantineProvider,
} from '@mantine/core';
import 'dayjs/locale/ru';
import { useRouter } from 'next/router';
import styles from '@styles/spinner.module.css';
import actionIconStyles from '@styles/ui/actionIcon.module.css';
import 'katex/dist/katex.min.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (_: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const theme = createTheme({
  autoContrast: true,
  luminanceThreshold: 0.6,
  defaultRadius: 'sm',
  primaryColor: 'primary',
  focusRing: 'auto',
  fontFamily: 'Roboto',
  breakpoints: {
    xs: em(480),
    sm: em(768),
    md: em(1280),
    lg: em(1440),
    xl: em(1920),
  },
  fontSizes: {
    xs: '0.7rem',
    sm: '0.9rem',
    md: '1rem',
    lg: '1.1rem',
    xl: '1.3rem',
  },
  headings: {
    fontWeight: '400',
  },
  components: {
    Badge: Badge.extend({
      defaultProps: {
        variant: 'outline',
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'transparent',
        className: actionIconStyles.button,
      },
    }),
    // Input: Input.extend({
    //   defaultProps: {
    //     size: 'md',
    //   },
    // }),
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
