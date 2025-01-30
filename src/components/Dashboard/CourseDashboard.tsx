import AttemptsList from '@components/Dashboard/AttemptsList/AttemptsList';
import TimeInfo from '@components/Dashboard/TimeInfo/TimeInfo';
import DeleteModal from '@components/Tournament/DeleteModal/DeleteModal';
import { STICKY_SIZES } from '@constants/Sizes';
import {
  ITournament,
  ITournamentResponse,
} from '@custom-types/data/ITournament';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useChatHosts } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { useUser } from '@hooks/useUser';
import { useWidth } from '@hooks/useWidth';
import { useInterval } from '@mantine/hooks';
import { Indicator } from '@ui/basics';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import {
  AddressBook,
  AlignRight,
  Ban,
  BellPlus,
  Messages,
  Pencil,
  Puzzle,
  Settings as SettingsIcon,
  Table,
  Trash,
  Users,
  Vocabulary,
} from 'tabler-icons-react';

import ChatPage from './ChatPage/ChatPage';
import CreateNotification from './CreateNotification/CreateNotification';
import ParticipantsListWithBan from './ParticipantsList/ParticipantsListWithBan';
import RegistrationManagement from './RegistrationManagement/RegistrationManagement';
import Results from './Results/Results';
import Settings from './Settings/Settings';
import TaskList from './TaskList/TaskList';
import TeamList from './TeamList/TeamList';

const CourseDashboard: FC<{
  spec: string;
}> = ({ spec }) => {
  // return <div>CourseDashboard</div>;

  const { locale } = useLocale();

  const [tournament, setTournament] = useState<ITournament>();

  const { data, refetch } = useRequest<undefined, ITournamentResponse>(
    `course/${spec}`,
    'GET'
  );

  const refetchTournament = useInterval(() => refetch(false), 60 * 1000);

  useEffect(() => {
    refetchTournament.start();
    return refetchTournament.stop;
  }, []); // eslint-disable-line

  useEffect(() => {
    if (data) setTournament(data.tournament);
  }, [data]);

  const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    let links = [
      {
        page: tournament && (
          <TimeInfo
            type={'tournament'}
            entity={{
              title: tournament.title,
              spec: tournament.spec,
              creator: tournament.author,
            }}
            timeInfo={{
              start: tournament.start,
              end: tournament.end,
              froze: tournament.frozeResults,
              status: tournament.status.spec as 0 | 1 | 2,
            }}
            refetch={() => refetch(false)}
          />
        ),
        icon: <Vocabulary color="var(--secondary)" />,
        title: locale.dashboard.tournament.mainInfo,
        section: 'tournament',
      },
      {
        page: <ChatPage spec={spec} entity="tournament" />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
            <Messages color="var(--secondary)" />{' '}
          </Indicator>
        ),
        title: locale.dashboard.tournament.chat,
        section: 'chat',
      },
      {
        page: tournament && (
          <Results
            spec={spec}
            isFinished={tournament.status.spec == 2}
            endDate={tournament.end}
            type={'tournament'}
            full
            is_team={tournament.maxTeamSize != 1}
          />
        ),
        icon: <Table color="var(--secondary)" />,
        title: locale.dashboard.tournament.results,
        section: 'results',
      },
      {
        page: tournament && (
          <AttemptsList
            key={'all'}
            type={'tournament'}
            spec={tournament.spec}
            shouldNotRefetch={tournament.status.spec != 1}
            isFinished={tournament.status.spec == 2}
            endDate={tournament.end}
          />
        ),
        icon: <AlignRight color="var(--secondary)" />,
        title: locale.dashboard.tournament.attempts,
        section: 'attempts',
      },
      {
        page: (
          <ParticipantsListWithBan
            type={'tournament'}
            team={tournament?.maxTeamSize != 1}
            spec={spec}
          />
        ),
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.tournament.participants,
        section: 'participants',
      },
      {
        page: <TaskList type={'tournament'} spec={spec} />,
        icon: <Puzzle color="var(--secondary)" />,
        title: locale.dashboard.tournament.tasks,
        section: 'tasks',
      },
      {
        page: (
          <RegistrationManagement
            spec={spec}
            maxTeamSize={tournament?.maxTeamSize || 1}
          />
        ),
        icon: <AddressBook color="var(--secondary)" />,
        title: locale.dashboard.tournament.registrationManagement,
        section: 'registration',
      },
      {
        page: tournament && (
          <CreateNotification spec={tournament.spec} type="tournament" />
        ),
        icon: <BellPlus color="var(--secondary)" />,
        title: locale.dashboard.tournament.createNotification,
        section: 'create_notification',
      },
      {
        page: tournament && (
          <AttemptsList
            key={'banned'}
            type={'tournament'}
            banned
            spec={tournament.spec}
            shouldNotRefetch={tournament.status.spec != 1}
            isFinished={tournament.status.spec == 2}
            endDate={tournament.end}
          />
        ),
        icon: <Ban color="var(--secondary)" />,
        title: locale.dashboard.tournament.bannedAttempts,
        section: 'banned_attempts',
      },
      {
        page: tournament && <Settings tournament={tournament} />,
        icon: <SettingsIcon color="var(--secondary)" />,
        title: locale.dashboard.tournament.settings.self,
        section: 'settings',
      },
    ];

    if (tournament?.maxTeamSize != 1) {
      links.splice(4, 0, {
        page: <TeamList spec={spec} />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.tournament.teams,
        section: 'teams',
      });
    }

    return links;
  }, [tournament, hasNewMessages, locale, refetch, spec]);

  const [activeModal, setActiveModal] = useState(false);

  const { isTeacher } = useUser();
  const { width } = useWidth();

  const actions: IStickyAction[] = [
    {
      color: 'green',
      icon: (
        <Pencil
          width={STICKY_SIZES[width] / 3}
          height={STICKY_SIZES[width] / 3}
        />
      ),
      href: `/tournament/edit/${spec}`,
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
      onClick: () => setActiveModal(true),
      description: locale.tip.sticky.tournament.delete,
    },
  ];

  return (
    <>
      {isTeacher && (
        <>
          {tournament && (
            <DeleteModal
              active={activeModal}
              setActive={setActiveModal}
              tournament={tournament}
            />
          )}
          <Sticky actions={actions} />
        </>
      )}
      <LeftMenu links={links} />
    </>
  );
};

export default memo(CourseDashboard);
