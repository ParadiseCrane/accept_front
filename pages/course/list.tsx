import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { ReactNode } from 'react';

function CourseListPage() {
  const { locale } = useLocale();
  return (
    <div>
      <Title title={locale.titles.courses} />
      <div>CourseListPage</div>
    </div>
  );
}

CourseListPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseListPage;
