'use client';
import { NextPage } from 'next';
import Todo from '@components/Todo/Todo';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';

const Soon: NextPage = () => {
  const { locale } = useLocale();
  return (
    <>
      <Title title={locale.titles.soon} />
      <Todo />
    </>
  );
};
export default Soon;
