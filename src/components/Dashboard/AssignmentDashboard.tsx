import { FC, memo, useEffect, useMemo, useState } from 'react';
import Results from '@components/Dashboard/Results/Results';
import AttemptsList from '@components/Dashboard/AttemptsList/AttemptsList';
import TimeInfo from '@components/Dashboard/TimeInfo/TimeInfo';
import ParticipantsList from '@components/Dashboard/ParticipantsList/ParticipantsList';
import TaskList from './TaskList/TaskList';
import CreateNotification from './CreateNotification/CreateNotification';
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
import { useLocale } from '@hooks/useLocale';
import { IAssignmentDisplay } from '@custom-types/data/IAssignment';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { useUser } from '@hooks/useUser';
import { useWidth } from '@hooks/useWidth';
import { STICKY_SIZES } from '@constants/Sizes';
import DeleteModal from '@components/Assignment/DeleteModal/DeleteModal';
import Sticky, { IStickyAction } from '@ui/Sticky/Sticky';
import { useRequest } from '@hooks/useRequest';
import { useInterval } from '@mantine/hooks';
import ChatPage from './ChatPage/ChatPage';
import { Indicator } from '@ui/basics';
import { useChatHosts } from '@hooks/useChatHosts';

const AssignmentDashboard: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();

  const [assignment, setAssignment] = useState<IAssignmentDisplay>();

  const { data, refetch } = useRequest<undefined, IAssignmentDisplay>(
    `assignment/display/${spec}`,
    'GET'
  );

  const refetchAssignment = useInterval(
    () => refetch(false),
    60 * 1000
  );

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
      },
      {
        page: <ChatPage entity={spec} type="assignment" />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
            <Messages color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.tournament.chat,
      },
      {
        page: assignment && (
          <Results
            spec={spec}
            isFinished={
              !assignment.infinite && assignment.status.spec == 2
            }
            endDate={assignment.end}
            type={'assignment'}
            full
            is_team={false}
          />
        ),
        icon: <Table color="var(--secondary)" />,

        title: locale.dashboard.assignment.results,
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
      },
      {
        page: <ParticipantsList type={'assignment'} spec={spec} />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.assignment.participants,
      },
      {
        page: <TaskList type={'assignment'} spec={spec} />,
        icon: <Puzzle color="var(--secondary)" />,
        title: locale.dashboard.assignment.tasks,
      },
      {
        page: assignment && (
          <CreateNotification
            spec={assignment.spec}
            type={'assignment'}
          />
        ),
        icon: <BellPlus color="var(--secondary)" />,
        title: locale.dashboard.assignment.createNotification,
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
      href: `/edu/assignment/edit/${spec}`,
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
