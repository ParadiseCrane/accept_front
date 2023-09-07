import { ReactNode, useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import Link from 'next/link';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { ITeam } from '@custom-types/data/ITeam';
import { UTCDate } from '@utils/datetime';
import Title from '@ui/Title/Title';
import PinModal from '@components/Tournament/PinModal/PinModal';
import { getApiUrl } from '@utils/getServerUrl';
import { REVALIDATION_TIME } from '@constants/PageRevalidation';
import styles from '@styles/team.module.css';
import { Key, Trash } from 'tabler-icons-react';
import { STICKY_SIZES } from '@constants/Sizes';
import { useWidth } from '@hooks/useWidth';
import TitleInput from '@components/Team/TitleInput/TitleInput';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import DeleteModal from '@components/Team/DeleteModal/DeleteModal';
import MemberItem from '@components/Team/MemberItem/MemberItem';

function TeamProfile(props: { team: ITeam }) {
  const team = props.team;
  const { locale } = useLocale();
  const { width } = useWidth();

  const [openedModal, setOpenedModal] = useState(false);
  const [openedDeleteModal, setOpenedDeleteModal] = useState(false);

  const { user, isAdmin } = useUser();

  const special = useMemo(
    () => !!(isAdmin || (user && user.login == team.capitan.login)),
    [isAdmin, user, team]
  );

  const actions: IStickyAction[] = useMemo(
    () => [
      {
        onClick: () => setOpenedDeleteModal(true),
        color: 'red',
        icon: (
          <Trash
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        description: locale.tip.sticky.team.delete,
      },
      {
        onClick: () => setOpenedModal(true),
        color: 'var(--secondary)',
        icon: (
          <Key
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        ),
        description: locale.tip.sticky.tournament.pin,
      },
    ],
    [locale, setOpenedDeleteModal, width]
  );

  return (
    <div className={styles.wrapper}>
      {special && (
        <>
          <Sticky actions={actions} />
          <PinModal
            origin={team.spec}
            active={openedModal}
            setActive={setOpenedModal}
          />
          <DeleteModal
            active={openedDeleteModal}
            setActive={setOpenedDeleteModal}
            team={team}
          />
        </>
      )}
      <Title title={`${locale.team.self} ${team.name}`} />
      <div className={styles.main}>
        <TitleInput
          special={special}
          spec={team.spec}
          title={team.name}
        />
        <div className={styles.info}>
          <div className={styles.date}>
            {locale.team.page.registrationDate}{' '}
            {UTCDate(new Date(team.date)).toLocaleString()}
          </div>

          <div className={styles.origin}>
            <div>{locale.team.page.participateIn}</div>
            <Link
              href={`/tournament/${team.origin.spec}`}
              className={styles.link}
            >
              {team.origin.title}
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.capitanWrapper}>
        <div className={styles.capitanLabel}>
          {locale.team.page.capitan}
        </div>
        <MemberItem team={team} participant={team.capitan} />
      </div>
      <div className={styles.participantsWrapper}>
        <div className={styles.participantsLabel}>
          {locale.team.page.participants}
        </div>
        <div className={styles.participantsList}>
          {team.participants.map((participant, index) => (
            <MemberItem
              key={index}
              team={team}
              participant={participant}
              special={
                special && participant.login != team.capitan.login
              }
            />
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
