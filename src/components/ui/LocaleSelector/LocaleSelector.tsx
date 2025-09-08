'use client';
import { useLocale } from '@hooks/useLocale';
import { UnstyledButton } from '@mantine/core';
import { FC, memo } from 'react';
import { IconLanguage } from '@tabler/icons-react';

import styles from './localeSelector.module.css';

const LocaleSelector: FC = () => {
  const { lang, set } = useLocale();
  const nextLang = lang === 'ru' ? 'en' : 'ru';

  return (
    <>
      <UnstyledButton
        onClick={() => {
          set(nextLang);
        }}
      >
        <div className={styles.wrapper}>
          <IconLanguage color={'white'} />
          {nextLang.toUpperCase()}
        </div>
      </UnstyledButton>
    </>
  );
};

export default memo(LocaleSelector);
