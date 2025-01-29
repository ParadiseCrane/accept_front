import { useLocale } from '@hooks/useLocale';
import styles from '@styles/error.module.css';
import Title from '@ui/Title/Title';
import { NextPage } from 'next';
import Link from 'next/link';

const Error: NextPage = () => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <Title title={'500'} />
      <div className={styles.statusCode}>{500}</div>
      <div className={styles.description}>{locale.errorPage.serverError}</div>
      <Link href="/" className={styles.return}>
        {locale.errorPage.returnToMain}
      </Link>
    </div>
  );
};
export default Error;
