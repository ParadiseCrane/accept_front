import { DefaultLayout } from '@layouts/DefaultLayout';
import { getApiUrl } from '@utils/getServerUrl';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ReactNode } from 'react';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';
import { ITeam } from '@custom-types/data/ITeam';
import styles from '@styles/team.module.css';
import Title from '@ui/Title/Title';
import { UTCDate } from '@utils/datetime';
import { Avatar } from '@mantine/core';
import { link } from '@constants/Avatar';
import Link from 'next/link';

function TeamProfile(props: { team: ITeam }) {
  let team = props.team;
  return (
    <div className={styles.wrapper}>
      <Title title={`Команда ${team.name}`} />
      {/* TODO: add locale */}
      <div className={styles.main}>
        <div className={styles.teamName}>Команда {team.name}</div>
        <div className={styles.date}>
          Создана {UTCDate(new Date(team.date)).toLocaleString()}
        </div>
      </div>
      <div className={styles.capitan}>
        <span>Капитан</span>
        <Link
          href={`/profile/${team.capitan.login}`}
          legacyBehavior
          passHref
        >
          <a className={styles.link}>
            <Avatar
              src={link(team.capitan.login)}
              size="lg"
              radius="lg"
            />
            <span>{team.capitan.shortName}</span>
          </a>
        </Link>
      </div>
      {team.participants.length != 1 && (
        <div className={styles.participants}>
          <span className={styles.participantsH}>{'Участники:'}</span>
          {team.participants
            .filter((item) => item.login != team.capitan.login)
            .map((participant, index) => (
              <Link
                key={index}
                href={`/profile/${participant.login}`}
                legacyBehavior
                passHref
              >
                <a className={styles.link}>
                  <Avatar
                    src={link(participant.login)}
                    size="lg"
                    radius="lg"
                  />
                  <span>{participant.shortName}</span>
                </a>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

TeamProfile.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default TeamProfile;

const API_URL = getApiUrl();

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || typeof params?.spec !== 'string') {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  const response = await fetch(`${API_URL}/api/team/${params.spec}`);
  if (response.status === 200) {
    const team = await response.json();
    return {
      props: {
        team,
      },
      revalidate: REVALIDATION_TIME.team.page,
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: '/404',
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
