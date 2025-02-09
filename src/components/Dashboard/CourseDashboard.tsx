import AttemptsList from '@components/Dashboard/AttemptsList/AttemptsList';
import TimeInfo from '@components/Dashboard/TimeInfo/TimeInfo';
import DeleteModal from '@components/Course/DeleteModal/DeleteModal';
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
import { ICourseModel, ICourseResponse } from '@custom-types/data/ICourse';
import Moderators from './Moderators/Moderators';
import GroupSelectorMenu from './GroupSelector/GroupSelector';

const CourseDashboard: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();

  const [course, setCourse] = useState<ICourseModel>();

  const { data, refetch } = useRequest<undefined, ICourseModel>(
    `course/${spec}`,
    'GET'
  );

  const refetchCourse = useInterval(() => refetch(false), 60 * 1000);

  useEffect(() => {
    refetchCourse.start();
    return refetchCourse.stop;
  }, []); // eslint-disable-line

  useEffect(() => {
    if (data) setCourse(data);
  }, [data]);

  const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    let links = [
      {
        page: <ChatPage spec={spec} entity="course" />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
            <Messages color="var(--secondary)" />{' '}
          </Indicator>
        ),
        title: locale.dashboard.course.chat,
        section: 'chat',
      },
      {
        page: <Moderators />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.course.moderators,
        section: 'moderators',
      },
    ];

    return links;
  }, [course, hasNewMessages, locale, refetch, spec]);

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
      href: `/course/edit/${spec}`,
      description: locale.tip.sticky.course.edit,
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
      description: locale.tip.sticky.course.delete,
    },
  ];

  return (
    <>
      {isTeacher && (
        <>
          {course && (
            <DeleteModal
              active={activeModal}
              setActive={setActiveModal}
              course={course}
            />
          )}
          <Sticky actions={actions} />
        </>
      )}
      <LeftMenu links={links} />
      <GroupSelectorMenu url={''} />
    </>
  );
};

export default memo(CourseDashboard);
