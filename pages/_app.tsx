import { BackNotificationsProvider } from '@hooks/useBackNotifications';
import { LocaleProvider } from '@hooks/useLocale';
import { UserProvider } from '@hooks/useUser';
import { WidthProvider } from '@hooks/useWidth';
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates';
import '@styles/globals.css';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import 'dayjs/locale/ru';

type NextPageWithLayout = NextPage & {
  getLayout?: (_: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function Accept({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <MantineProvider
      withCSSVariables
      theme={{
        colors: {
          white: ['#ffffff'],
          'old-accept': ['#87ceeb'],
          future: ['#f880fe'],
        },
      }}
    >
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
