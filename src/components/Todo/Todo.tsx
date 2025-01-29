import { useLocale } from '@hooks/useLocale';
import styles from '@styles/error.module.css';
import Link from 'next/link';
import { FC } from 'react';

const Todo: FC<{}> = () => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <div className={styles.statusCode}>{locale.todo.title}</div>
      <div className={styles.description}>{locale.todo.description}</div>
      <Link href="/" className={styles.return}>
        {locale.errorPage.returnToMain}
      </Link>
    </div>
  );
};
export default Todo;
