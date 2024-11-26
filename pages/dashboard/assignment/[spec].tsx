import { ReactNode } from 'react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import AssignmentDashboard from '@components/Dashboard/AssignmentDashboard';
import { useLocale } from '@hooks/useLocale';
import Title from '@ui/Title/Title';
import { ChatHostsProvider } from '@hooks/useChatHosts';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';

function AssignmentDashboardPage(props: { spec: string }) {
  const { locale } = useLocale();
  const refetchIntervalSeconds = 8;

  return (
    <>
      <Title title={locale.titles.dashboard.assignment} />
      <ChatHostsProvider
        spec={props.spec}
        entity={'assignment'}
        updateIntervalSeconds={refetchIntervalSeconds}
      >
        <AssignmentDashboard spec={props.spec} />
      </ChatHostsProvider>
    </>
  );
}

AssignmentDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AssignmentDashboardPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }
  return {
    props: { spec: params.spec },
    revalidate: REVALIDATION_TIME.dashboard.assignment,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
