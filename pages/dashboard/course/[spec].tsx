import CourseDashboard from '@components/Dashboard/CourseDashboard';
import LessonDashboard from '@components/Dashboard/LessonDashboard';
import UnitDashboard from '@components/Dashboard/UnitDashboard';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';
import { ICourse, ILesson, IUnit } from '@custom-types/data/ICourse';
import { ChatHostsProvider } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps, GetStaticPaths } from 'next';
import { ReactNode } from 'react';

function CourseDashboardPage(props: {
  entity: ICourse | IUnit | ILesson;
  courseSpec: string;
}) {
  const { locale } = useLocale();
  const refetchIntervalSeconds = 8;

  if (props.entity.kind === 'lesson') {
    return (
      <>
        <Title title={locale.titles.dashboard.lesson} />
        <LessonDashboard
          spec={props.entity.spec}
          courseSpec={props.courseSpec}
        />
      </>
    );
  }

  if (props.entity.kind === 'unit') {
    return (
      <>
        <Title title={locale.titles.dashboard.unit} />
        <UnitDashboard spec={props.entity.spec} courseSpec={props.courseSpec} />
      </>
    );
  }

  return (
    <>
      <Title title={locale.titles.dashboard.course} />
      <ChatHostsProvider
        spec={props.entity.spec}
        entity={'course'}
        updateIntervalSeconds={refetchIntervalSeconds}
      >
        <CourseDashboard
          spec={props.entity.spec}
          courseSpec={props.courseSpec}
        />
      </ChatHostsProvider>
    </>
  );
}

CourseDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseDashboardPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec || Array.isArray(query.spec)) {
    return {
      notFound: true,
    };
  }

  const response = await fetchWrapperStatic({
    url: `course/${req.url?.split('?item=').pop()!.split('&spec')[0]}`,
    req,
  });

  if (response.status === 200) {
    const json: ICourse | IUnit | ILesson = await response.json();
    const entity = {
      ...json,
      spec: req.url?.split('?item=').pop()!.split('&spec')[0],
    };

    return {
      props: { entity: entity, courseSpec: query.spec },
    };
  }

  return {
    notFound: true,
  };
};
