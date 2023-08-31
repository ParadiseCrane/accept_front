import { ReactNode } from 'react';
import { DefaultLayout } from '@layouts/DefaultLayout';
import Results from '@components/Dashboard/Results/Results';
import { ITournament } from '@custom-types/data/ITournament';
import { GetServerSideProps } from 'next';
import { getApiUrl } from '@utils/getServerUrl';
import { useUser } from '@hooks/useUser';
import { useLocale } from '@hooks/useLocale';
import Title from '@ui/Title/Title';
import styles from '@styles/results.module.css';

function Tournament({ tournament }: { tournament: ITournament }) {
  const { user, isTeacher } = useUser();

  const { locale } = useLocale();

  return (
    <>
      <Title
        title={`${locale.titles.tournament.results} ${tournament.title}`}
      />
      <div className={styles.wrapper}>
        <div
          className={styles.title}
        >{`${locale.titles.tournament.results} ${tournament.title}`}</div>
        <div className={styles.resultsWrapper}>
          <Results
            spec={tournament.spec}
            type={'tournament'}
            isFinished={tournament.status.spec == 2}
            endDate={tournament.end}
            full={
              isTeacher ||
              (!!user && user?.login in tournament.moderators)
            }
            is_team={tournament.maxTeamSize != 1}
          />
        </div>
      </div>
    </>
  );
}

Tournament.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Tournament;
const API_URL = getApiUrl();

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  if (!query.spec) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }
  const spec = query.spec;

  const response = await fetch(`${API_URL}/api/tournament/${spec}`, {
    headers: {
      cookie: req.headers.cookie,
    } as { [key: string]: string },
  });

  if (response.status === 200) {
    const payload = await response.json();
    return {
      props: {
        tournament: payload.tournament,
      },
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};
