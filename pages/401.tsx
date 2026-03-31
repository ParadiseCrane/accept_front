"use client";
import { useLocale } from "@hooks/useLocale";
import styles from "@styles/error.module.css";
import { IconArrowLeft } from "@tabler/icons-react";
import Title from "@ui/Title/Title";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Error: NextPage = () => {
  const { locale } = useLocale();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const from = router.query.from as string | undefined;
  const [buttonLink, setButtonLink] = useState<string>("");

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  useEffect(() => {
    if (from && router.pathname === "/401") {
      window.history.replaceState(null, "", from);
    }
  }, [from, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setButtonLink(`/signin?referrer=${window.location.pathname}`);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <Title title={"401 | Accept"} />
      <div className={styles.statusCode}>{401}</div>
      <div className={styles.description}>{locale.errorPage.signInTitle}</div>
      <Link href={buttonLink} className={styles.return}>
        {locale.errorPage.signIn}
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
export default Error;
