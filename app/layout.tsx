import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/code-highlight/styles.css";
import "@styles/globals.css";
import "@styles/tiptap.css";
import "dayjs/locale/ru";
import "katex/dist/katex.min.css";

import { BackNotificationsProvider } from "@hooks/useBackNotifications";
import { LocaleProvider } from "@hooks/useLocale";
import { UserProvider } from "@hooks/useUser";
import { WidthProvider } from "@hooks/useWidth";
import { mantineHtmlProps, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { ColorSchemeScript } from "@mantine/core";
import React from "react";
import { theme } from "@constants/Theme";
import type { Metadata, Viewport } from "next";
import { Exo_2, Red_Hat_Mono } from "next/font/google";
import { TipTapBubbleMenuProvider } from "@hooks/useTipTapBubbleMenu";
import Script from "next/script";
import QueryProvider from "@requests/QueryProvider";

export const metadata: Metadata = {
  title: "Accept",
  description:
    "централизованная платформа, ориентированная на автоматизацию обучения программированию и повышение эффективности работы преподавателей с применением AI, а именно: проверка AI-плагиата, персонализированные подсказки об ошибках в коде, стилизация условий задач (для преподавателей), персонализированные рекомендации задач пользователям. ",
  creator: "Accept Team",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const exo2 = Exo_2({
  subsets: ["cyrillic", "latin"],
});

const rhat_mono = Red_Hat_Mono({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={exo2.className + " " + rhat_mono.className}
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="05d82b05-8d63-46e3-98d4-4366e22b0e65"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <DatesProvider settings={{ locale: "ru" }}>
            <WidthProvider>
              <LocaleProvider>
                <UserProvider>
                  <TipTapBubbleMenuProvider>
                    <Notifications
                      position="bottom-left"
                      zIndex={9999}
                      limit={5}
                      autoClose={40000}
                    />
                    <QueryProvider>
                      <BackNotificationsProvider>
                        {children}
                      </BackNotificationsProvider>
                    </QueryProvider>
                  </TipTapBubbleMenuProvider>
                </UserProvider>
              </LocaleProvider>
            </WidthProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
