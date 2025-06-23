import UnitDashboard from '@components/Dashboard/UnitDashboard';
import { ICourse, IUnit } from '@custom-types/data/ICourse';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';

function UnitDashboardPage(props: {
  entity: IUnit;
  courseSpec: string;
  courseAuthor: string;
}) {
  const { locale } = useLocale();
  const { user } = useUser();

  if (!user) return;

  return (
    <>
      <Title title={locale.titles.dashboard.unit} />
      <UnitDashboard
        unit={props.entity}
        courseSpec={props.courseSpec}
        isAuthor={user && user.login === props.courseAuthor}
      />
    </>
  );
}

UnitDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default UnitDashboardPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec || Array.isArray(query.spec)) {
    return {
      notFound: true,
    };
  }

  const courseSpec = req.url?.split('?course=').pop()!.split('&')[0].toString();

  const entityResponse = await fetchWrapperStatic({
    url: `course/${query.spec}`,
    req,
  });

  const courseResponse = await fetchWrapperStatic({
    url: `course/${courseSpec}`,
    req,
  });

  if (entityResponse.status === 200 && courseResponse.status === 200) {
    const entity = await entityResponse.json();
    const courseAuthor = (await courseResponse.json()).author;

    if (entity.kind === 'unit') {
      return {
        props: { entity: entity, courseSpec, courseAuthor },
      };
    }
  }

  return {
    notFound: true,
  };
};
