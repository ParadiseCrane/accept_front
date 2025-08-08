'use client';
import { useLocale } from '@hooks/useLocale';
import styles from '@styles/error.module.css';
import { IconArrowLeft } from '@tabler/icons-react';
import Title from '@ui/Title/Title';
import { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Error: NextPage<{ statusCode?: number; error?: Error }> = ({ error }) => {
  const { locale } = useLocale();
  const [canGoBack, setCanGoBack] = useState(false);
  const router = useRouter();
  const [statusCode, setStatusCode] = useState<number | null>();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <Title title={statusCode?.toString() || locale.error} />
      <div className={styles.statusCode}>{statusCode}</div>
      <div className={styles.description}>{locale.errorPage.description}</div>
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
          <IconArrowLeft /> {locale.errorPage.goBack}
        </Link>
      )}
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
