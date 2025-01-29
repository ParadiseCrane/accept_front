import { useLocale } from '@hooks/useLocale';
import Image from 'next/legacy/image';
import packageInfo from 'package.json';
import { FC, memo } from 'react';

import styles from './topContent.module.css';

const version = packageInfo.version;

const TopContent: FC = () => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image src={'/logo.svg'} width="140" height="140" alt="logo"></Image>
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{locale.accept}</div>
          <div className={styles.version}>{'v' + version}</div>
        </div>
      </div>
    </div>
  );
};

export default memo(TopContent);
