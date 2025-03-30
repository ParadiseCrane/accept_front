import { useLocale } from '@hooks/useLocale';
import { Center } from '@mantine/core';
import styles from '@styles/layouts/login.module.css';
import Title from '@ui/Title/Title';
import Image from 'next/legacy/image';
import logo from 'public/logo.svg';
import { FC, ReactNode } from 'react';

export const LoginLayout: FC<{
  title: 'login' | 'registration';
  children: ReactNode;
}> = ({ title, children }) => {
  const { locale } = useLocale();

  return (
    <div className={styles.pageWrapper}>
      <Title title={locale.auth[title]} />
      <Center className={styles.wrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.logoWrapper}>
            <Image src={logo} width={50} height={50} alt="Logo image" />
            <div className={styles.title}>
              {locale.accept} | {locale.auth[title]}
            </div>
          </div>
          {children}
        </div>
      </Center>
    </div>
  );
};
