import TournamentDashboard from '@components/Dashboard/TournamentDashboard';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';
import { ITournamentResponse } from '@custom-types/data/ITournament';
import { ChatHostsProvider } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Title from '@ui/Title/Title';
import { getApiUrl } from '@utils/getServerUrl';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ReactNode } from 'react';

function TournamentDashboardPage(props: { spec: string }) {
  const { locale } = useLocale();
  const refetchIntervalSeconds = 8;

  return (
    <>
      <Title title={locale.titles.dashboard.tournament} />
      <ChatHostsProvider
        spec={props.spec}
        entity={'tournament'}
        updateIntervalSeconds={refetchIntervalSeconds}
      >
        <TournamentDashboard spec={props.spec} />
      </ChatHostsProvider>
    </>
  );
}

TournamentDashboardPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default TournamentDashboardPage;

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
    revalidate: REVALIDATION_TIME.dashboard.tournament,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
