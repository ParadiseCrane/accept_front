import { ReactNode } from 'react';
import { GetServerSideProps } from 'next';
import { DefaultLayout } from '@layouts/DefaultLayout';
import AssignmentDashboard from '@components/Dashboard/AssignmentDashboard';
import { useLocale } from '@hooks/useLocale';
import Title from '@ui/Title/Title';
import { ChatHostsProvider } from '@hooks/useChatHosts';
import { fetchWrapperStatic } from '@utils/fetchWrapper';

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

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  if (!query.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }

  const response = await fetchWrapperStatic({
    url: `exists/assignment/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    return {
      props: { spec: query.spec },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
