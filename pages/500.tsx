import { useLocale } from '@hooks/useLocale';
import styles from '@styles/error.module.css';
import { IconArrowLeft } from '@tabler/icons-react';
import Title from '@ui/Title/Title';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Error: NextPage = () => {
  const { locale } = useLocale();
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const from = router.query.from as string | undefined;

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  useEffect(() => {
    if (from && router.pathname === '/500') {
      window.history.replaceState(null, '', from);
    }
  }, [from, router]);

  return (
    <div className={styles.wrapper}>
      <Title title={'500'} />
      <div className={styles.statusCode}>{500}</div>
      <div className={styles.description}>{locale.errorPage.serverError}</div>
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
export default Error;
