"use client";
import Results from "@components/Dashboard/Results/Results";
import { ITournament } from "@custom-types/data/ITournament";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { DefaultLayout } from "@layouts/DefaultLayout";
import styles from "@styles/results.module.css";
import Title from "@ui/Title/Title";
import { fetchWrapperStatic } from "@utils/fetchWrapper";
import { GetServerSideProps } from "next";
import { ReactNode } from "react";

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
            type={"tournament"}
            isFinished={tournament.status.spec == 2}
            endDate={tournament.end}
            full={isTeacher || (!!user && user?.login in tournament.moderators)}
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  if (!query.spec) {
    return {
      notFound: true,
    };
  }

  const response = await fetchWrapperStatic({
    url: `tournament/${query.spec}`,
    req,
  });

  if (response.status === 200) {
    const payload = await response.json();
    return {
      props: {
        tournament: payload,
      },
    };
  }
  return {
    notFound: true,
  };
};
