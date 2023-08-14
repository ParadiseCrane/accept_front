import { ReactNode, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useUser } from '@hooks/useUser';
import { useWidth } from '@hooks/useWidth';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { getApiUrl } from '@utils/getServerUrl';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import DeleteModal from '@components/Tournament/DeleteModal/DeleteModal';
import PinModal from '@components/Tournament/PinModal/PinModal';
import Description from '@components/Tournament/Description/Description';
import {
  Dashboard,
  Key,
  Pencil,
  PlaylistAdd,
  ReportAnalytics,
  Trash,
} from 'tabler-icons-react';
import { STICKY_SIZES } from '@constants/Sizes';
import { ITournament } from '@custom-types/data/ITournament';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';
import Timer from '@ui/Timer/Timer';
import ChatSticky from '@ui/ChatSticky/ChatSticky';
import SingularSticky from '@ui/Sticky/SingularSticky';

function Tournament(props: { tournament: ITournament }) {
  const tournament = props.tournament;
  const [activeDeleteModal, setActiveDeleteModal] = useState(false);
  const [activePinModal, setActivePinModal] = useState(false);
  const { locale } = useLocale();

  const { isAdmin, user } = useUser();
  const { width } = useWidth();

  const special = useMemo(
    () =>
      isAdmin ||
      tournament.moderators.includes(user?.login || '') ||
      tournament.author == user?.login,
    [isAdmin, tournament.author, tournament.moderators, user?.login]
  );

  const actions: IStickyAction[] = [
    {
      color: 'grape',
      icon: (
        <Dashboard
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      href: `/dashboard/tournament/${tournament.spec}`,
      description: locale.tip.sticky.tournament.dashboard,
    },
    {
      color: 'blue',
      icon: (
        <Key
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      onClick: () => setActivePinModal(true),
      description: locale.tip.sticky.tournament.pin,
    },
    {
      color: 'green',
      icon: (
        <PlaylistAdd
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      href: `/task/add?tournament=${tournament.spec}`,
      description: locale.tip.sticky.task.add,
    },

    {
      color: 'green',
      icon: (
        <Pencil
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      href: `/tournament/edit/${tournament.spec}`,
      description: locale.tip.sticky.tournament.edit,
    },

    {
      color: 'red',
      icon: (
        <Trash
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      onClick: () => setActiveDeleteModal(true),
      description: locale.tip.sticky.tournament.delete,
    },
  ];

  return (
    <>
      <Title
        title={`${locale.titles.tournament.spec} ${tournament.title}`}
      />
      {special ? (
        <>
          <DeleteModal
            active={activeDeleteModal}
            setActive={setActiveDeleteModal}
            tournament={tournament}
          />
          <PinModal
            active={activePinModal}
            setActive={setActivePinModal}
            spec={tournament.spec}
          />
          <Sticky actions={actions} />
        </>
      ) : (
        tournament.participants.includes(user?.login || '') &&
        tournament.status.spec != 0 && (
          <SingularSticky
            icon={
              <ReportAnalytics
                width={STICKY_SIZES[width] / 2}
                height={STICKY_SIZES[width] / 2}
              />
            }
            href={`/tournament/results/${tournament.spec}`}
            description={locale.tip.sticky.tournament.results}
          />
        )
      )}
      {user &&
        (special || tournament.participants.includes(user.login)) && (
          <ChatSticky spec={tournament.spec} host={user.login} />
        )}
      <Timer url={`tournament/info/${tournament.spec}`} />
      <Description tournament={tournament} />
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
    const tournament = await response.json();

    return {
      props: {
        tournament,
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
