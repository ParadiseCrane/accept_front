import { useLocale } from '@hooks/useLocale';
import styles from '@styles/error.module.css';
import Title from '@ui/Title/Title';
import { NextPage, NextPageContext } from 'next';
import Link from 'next/link';

const Error: NextPage<{ statusCode?: number }> = ({ statusCode }) => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <Title title={statusCode?.toString() || locale.error} />
      <div className={styles.statusCode}>{statusCode}</div>
      <div className={styles.description}>{locale.errorPage.description}</div>
      <Link href="/" className={styles.return}>
        {locale.errorPage.returnToMain}
      </Link>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
