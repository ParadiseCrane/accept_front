import DeleteModal from '@components/Assignment/DeleteModal/DeleteModal';
import AttemptsList from '@components/Dashboard/AttemptsList/AttemptsList';
import ParticipantsList from '@components/Dashboard/ParticipantsList/ParticipantsList';
import Results from '@components/Dashboard/Results/Results';
import TimeInfo from '@components/Dashboard/TimeInfo/TimeInfo';
import { STICKY_SIZES } from '@constants/Sizes';
import { IAssignmentDisplay } from '@custom-types/data/IAssignment';
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
  AlignRight,
  BellPlus,
  Messages,
  Pencil,
  Puzzle,
  Table,
  Trash,
  Users,
  Vocabulary,
} from 'tabler-icons-react';

import ChatPage from './ChatPage/ChatPage';
import CreateNotification from './CreateNotification/CreateNotification';
import TaskList from './TaskList/TaskList';

const AssignmentDashboard: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();

  const [assignment, setAssignment] = useState<IAssignmentDisplay>();

  const { data, refetch } = useRequest<undefined, IAssignmentDisplay>(
    `assignment/display/${spec}`,
    'GET'
  );

  const refetchAssignment = useInterval(() => refetch(false), 60 * 1000);

  const { hasNewMessages } = useChatHosts();

  useEffect(() => {
    refetchAssignment.start();
    return refetchAssignment.stop;
  }, []); // eslint-disable-line

  useEffect(() => {
    if (data) setAssignment(data);
  }, [data]);

  const links: IMenuLink[] = useMemo(
    () => [
      {
        page: assignment && (
          <TimeInfo
            type={'assignment'}
            entity={{
              title: assignment.title,
              spec: assignment.spec,
              creator: assignment.starter,
            }}
            timeInfo={{
              start: assignment.start,
              end: assignment.end,
              status: assignment.status.spec as 0 | 1 | 2,
              infinite: assignment.infinite,
            }}
            refetch={() => refetch(false)}
          />
        ),
        icon: <Vocabulary color="var(--secondary)" />,
        title: locale.dashboard.assignment.mainInfo,
        section: 'assignment',
      },
      {
        page: <ChatPage entity={'assignment'} spec={spec} />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
            <Messages color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.tournament.chat,
        section: 'chat',
      },
      {
        page: assignment && (
          <Results
            spec={spec}
            isFinished={!assignment.infinite && assignment.status.spec == 2}
            endDate={assignment.end}
            type={'assignment'}
            full
            is_team={false}
          />
        ),
        icon: <Table color="var(--secondary)" />,
        title: locale.dashboard.assignment.results,
        section: 'results',
      },
      {
        page: assignment && (
          <AttemptsList
            type={'assignment'}
            spec={assignment.spec}
            shouldNotRefetch={assignment.status.spec != 1}
            isFinished={assignment.status.spec == 2}
            endDate={assignment.end}
          />
        ),
        icon: <AlignRight color="var(--secondary)" />,
        title: locale.dashboard.assignment.attempts,
        section: 'attempts',
      },
      {
        page: <ParticipantsList type={'assignment'} spec={spec} />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.assignment.participants,
        section: 'participants',
      },
      {
        page: <TaskList type={'assignment'} spec={spec} />,
        icon: <Puzzle color="var(--secondary)" />,
        title: locale.dashboard.assignment.tasks,
        section: 'tasks',
      },
      {
        page: assignment && (
          <CreateNotification spec={assignment.spec} type={'assignment'} />
        ),
        icon: <BellPlus color="var(--secondary)" />,
        title: locale.dashboard.assignment.createNotification,
        section: 'create_notifications',
      },
    ],
    [assignment, hasNewMessages, locale, refetch, spec]
  );

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
      href: `/assignment/edit/${spec}`,
      description: locale.tip.sticky.assignment.edit,
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
      description: locale.tip.sticky.assignment.delete,
    },
  ];

  return (
    <>
      {isTeacher && (
        <>
          {assignment && (
            <DeleteModal
              active={activeModal}
              setActive={setActiveModal}
              assignment={assignment}
            />
          )}
          <Sticky actions={actions} />
        </>
      )}
      <LeftMenu links={links} />
    </>
  );
};

export default memo(AssignmentDashboard);
