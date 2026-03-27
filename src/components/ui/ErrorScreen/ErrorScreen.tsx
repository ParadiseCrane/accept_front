"use client";
import { useLocale } from "@hooks/useLocale";
import styles from "@styles/error.module.css";
import { IconArrowLeft } from "@tabler/icons-react";
import Title from "@ui/Title/Title";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ErrorScreenAppDirectories: NextPage<{ statusCode?: number }> = ({
  statusCode,
}) => {
  const { locale } = useLocale();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <Title title={statusCode?.toString() || locale.error} />
      <div className={styles.statusCode}>{statusCode}</div>
      <div className={styles.description}>
        {locale.errorPage.getTitle(statusCode ?? 404)}
      </div>
      <Link href="/" className={styles.return}>
        {locale.errorPage.returnToMain}
      </Link>
      {canGoBack && (
        <Link
          href="/"
          className={styles.goBack}
          onClick={(e) => {
            e.preventDefault();
            if (canGoBack) handleBack();
          }}
        >
          <IconArrowLeft />
          {locale.errorPage.goBack}
        </Link>
      )}
    </div>
  );
};
