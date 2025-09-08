"use client";

import { useLocale } from "@hooks/useLocale";
import styles from "@styles/error.module.css";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, MouseEvent } from "react";

function Error({ error, reset }: { error: Error; reset: () => void }) {
  const { locale } = useLocale();
  const [canGoBack, setCanGoBack] = useState(false);
  const router = useRouter();
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const getMainHref = () => {
    if (statusCode === 401) {
      return `/signin?referrer=${window.location.pathname}`;
    }

    return "/";
  };

  const arrowAction = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      router.back();
    },
    [router],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  useEffect(() => {
    if (error && error.message.includes("code")) {
      const message: { code: number; message: string } = JSON.parse(
        error.message,
      );
      setStatusCode(message.code);
    } else {
      setStatusCode(404);
    }
  }, [error, router]);

  useEffect(() => {
    if (statusCode && document) {
      document.title = `${statusCode} | ${locale.errorPage.getTitle(
        statusCode,
      )}`;
    }
  }, [statusCode, locale.errorPage]);

  if (!statusCode) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.statusCode}>{statusCode}</div>
      <div className={styles.description}>
        {locale.errorPage.getTitle(statusCode)}
      </div>
      <Link href={getMainHref()} className={styles.return}>
        {locale.errorPage.getButtonTitle(statusCode)}
      </Link>
      {canGoBack && (
        <Link href="/" className={styles.goBack} onClick={arrowAction}>
          <IconArrowLeft /> {locale.errorPage.goBack}
        </Link>
      )}
    </div>
  );
}

export default Error;
