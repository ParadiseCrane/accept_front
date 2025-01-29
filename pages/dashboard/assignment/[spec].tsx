import AssignmentDashboard from '@components/Dashboard/AssignmentDashboard';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';
import { ChatHostsProvider } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { fetchWrapperStatic } from '@utils/fetchWrapper';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { ReactNode } from 'react';

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
