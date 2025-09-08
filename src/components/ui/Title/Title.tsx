'use client';
import { useLocale } from '@hooks/useLocale';
import Head from 'next/head';
import { FC, memo } from 'react';

const Title: FC<{ title: string }> = ({ title }) => {
  const { locale } = useLocale();
  return (
    <Head>
      <title>{`${title} | ${locale.titles.accept}`}</title>
    </Head>
  );
};

export default memo(Title);
