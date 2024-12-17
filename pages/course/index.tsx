import { NextPage } from 'next';
import Todo from '@components/Todo/Todo';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';

const Courses: NextPage = () => {
  const { locale } = useLocale();
  return (
    <>
      <Title title={locale.titles.courses} />
      <Todo />
    </>
  );
};
export default Courses;
