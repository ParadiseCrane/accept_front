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
import { useLocale } from '@hooks/useLocale';

function TeamProfile(props: { team: ITeam }) {
  const team = props.team;
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <Title title={`${locale.team.self} ${team.name}`} />
      {/* TODO: add locale */}
      <div className={styles.main}>
        <div className={styles.teamName}>
          {locale.team.self} {team.name}
        </div>
        <div className={styles.info}>
          <div className={styles.date}>
            {locale.team.page.registrationDate}{' '}
            {UTCDate(new Date(team.date)).toLocaleString()}
          </div>

          <div className={styles.origin}>
            <div>{locale.team.page.participateIn}</div>
            <Link
              href={`/tournament/${team.origin.spec}`}
              legacyBehavior
              passHref
            >
              <a className={styles.link}>{team.origin.title}</a>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.capitanWrapper}>
        <div className={styles.capitanLabel}>
          {locale.team.page.capitan}
        </div>

        <Link
          href={`/profile/${team.capitan.login}`}
          legacyBehavior
          passHref
          className={styles.capitan}
        >
          <a className={styles.link}>
            <Avatar
              src={link(team.capitan.login)}
              size="lg"
              radius="lg"
            />
            <div>{team.capitan.shortName}</div>
          </a>
        </Link>
      </div>
      <div className={styles.participantsWrapper}>
        <div className={styles.participantsLabel}>
          {locale.team.page.participants}
        </div>
        <div className={styles.participantsList}>
          {team.participants.map((participant, index) => (
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
                <div>{participant.shortName}</div>
              </a>
            </Link>
          ))}
        </div>
      </div>
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
  if (response.status === 307) {
    let data = await response.json();
    return {
      redirect: {
        permanent: false,
        destination: `/profile/${data.detail.capitan}`,
      },
    };
  }
  if (response.status === 200) {
    const team = await response.json();

    if (team.size == 1) {
      return {
        redirect: {
          permanent: false,
          destination: `/profile/${team.capitan}`,
        },
      };
    }
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
