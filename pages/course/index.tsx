import Todo from '@components/Todo/Todo';
import { useLocale } from '@hooks/useLocale';
import Title from '@ui/Title/Title';
import { NextPage } from 'next';

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
