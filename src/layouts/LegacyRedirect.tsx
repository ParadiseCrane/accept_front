'use client';
import styles from '@styles/error.module.css';

import { FC } from 'react';

import Title from '@ui/Title/Title';
import Link from 'next/link';

export const LegacyRedirect: FC<{}> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <Title title={'Переезд!'} />
      <div
        style={{
          fontSize: '10rem',
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        🚛🚛🚛🚛
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: '2.2rem',
        }}
      >
        <div>Accept переехал на новый адрес!</div>
        <div>
          Переходите по ссылке ниже и продолжайте пользоваться нашей
          системой!
        </div>
      </div>
      <Link href="https://код.ацепт.рф/" className={styles.return}>
        Перейти на новый сайт!
      </Link>
      <div
        style={{
          textAlign: 'center',
          fontSize: '1.5rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        <div>P.S. А ещё у нас есть </div>
        <Link
          style={{
            textDecoration: 'unset',
            color: 'var(--primary)',
            backgroundColor: 'white',
            borderRadius: '5px',
            padding: 'var(--spacer-xs) var(--spacer-s)',
          }}
          href="https://ацепт.рф/"
        >
          Лендинг
        </Link>
      </div>
      <div style={{ color: 'var(--primary)' }}>
        чтобы продолжить на этом сайте, добавьте в куках skip=1
      </div>
    </div>
  );
};
