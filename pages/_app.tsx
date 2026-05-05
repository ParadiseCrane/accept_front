"use client";
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
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import styles from "@styles/spinner.module.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { theme } from "@constants/Theme";
import { TipTapBubbleMenuProvider } from "@hooks/useTipTapBubbleMenu";
import Head from "next/head";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@requests/request";

type NextPageWithLayout = NextPage & {
  getLayout?: (_: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function Accept({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query.tab) return;
    const handleStart = () => setLoading(true);
    const handleEnd = () => setLoading(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleEnd);
    router.events.on("routeChangeError", handleEnd);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleEnd);
      router.events.off("routeChangeError", handleEnd);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <QueryClientProvider client={queryClient}>
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
                    <BackNotificationsProvider>
                      <div
                        className={`${styles.spinner} ${
                          loading ? styles.active : ""
                        }`}
                      />
                      {getLayout(<Component {...pageProps} />)}
                    </BackNotificationsProvider>
                  </TipTapBubbleMenuProvider>
                </UserProvider>
              </LocaleProvider>
            </WidthProvider>
          </DatesProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}

export default Accept;
