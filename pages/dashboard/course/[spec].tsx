import CourseDashboard from '@components/Dashboard/CourseDashboard';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';
import { ChatHostsProvider } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ReactNode } from 'react';

function CourseDashboardPage(props: { spec: string }) {
  const { locale } = useLocale();
  const refetchIntervalSeconds = 8;

  return (
    <>
      <Title title={locale.titles.dashboard.course} />
      <ChatHostsProvider
        spec={props.spec}
        entity={'course'}
        updateIntervalSeconds={refetchIntervalSeconds}
      >
        <CourseDashboard spec={props.spec} />
      </ChatHostsProvider>
    </>
  );
}

CourseDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CourseDashboardPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.spec) {
    return {
      notFound: true,
    };
  }
  return {
    props: { spec: params.spec },
    revalidate: REVALIDATION_TIME.dashboard.course,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
