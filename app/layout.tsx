import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/code-highlight/styles.css';
import '@styles/globals.css';
import '@styles/tiptap.css';
import 'dayjs/locale/ru';
import 'katex/dist/katex.min.css';

import { BackNotificationsProvider } from '@hooks/useBackNotifications';
import { LocaleProvider } from '@hooks/useLocale';
import { UserProvider } from '@hooks/useUser';
import { WidthProvider } from '@hooks/useWidth';
import { mantineHtmlProps, MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { ColorSchemeScript } from '@mantine/core';
import React from 'react';
import { theme } from '@constants/Theme';
import { Metadata } from 'next';
import { Exo_2, Red_Hat_Mono } from 'next/font/google';

// export const metadata: Metadata = {}

const exo2 = Exo_2({
  subsets: ['cyrillic', 'latin'],
});

const rhat_mono = Red_Hat_Mono({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={exo2.className + ' ' + rhat_mono.className}
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
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
                    {children}
                  </BackNotificationsProvider>
                </UserProvider>
              </LocaleProvider>
            </WidthProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
