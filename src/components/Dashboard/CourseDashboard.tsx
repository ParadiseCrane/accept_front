import DeleteModal from '@components/Course/DeleteModal/DeleteModal';
import { STICKY_SIZES } from '@constants/Sizes';
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
import { Messages, Pencil, Trash, Users } from 'tabler-icons-react';
import {
  IconUsersGroup,
  IconUserCog,
  IconArticle,
  IconList,
  IconBellPlus,
  IconLockCog,
} from '@tabler/icons-react';

import ChatPage from './ChatPage/ChatPage';
import { ICourseModel } from '@custom-types/data/ICourse';
import Moderators from './Moderators/Moderators';
import GroupSelectorMenu from './GroupSelector/GroupSelector';
import CourseParticipants from '@components/Dashboard/CourseParticipants/CourseParticipants';
import CourseMain from './CourseMain/CourseMain';
import Groups from './Groups/Groups';
import { useSearchParams } from 'next/navigation';
import CreateNotificationCourse from './CreateNotificationCourse/CreateNotificationCourse';
import CourseChatPage from './CourseChatPage/CourseChatPage';
import GroupOpenness from './GroupOpenness/GroupOpenness';

const CourseDashboard: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();
  const { user } = useUser();
  const [isAuthor, setIsAuthor] = useState<boolean | null>(null);
  const params = useSearchParams();

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

  useEffect(() => {
    if (user && course && user.login !== course.author) {
      setIsAuthor(false);
    }
    if (user && course && user.login === course.author) {
      setIsAuthor(true);
    }
  }, [user, course]);

  const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    let links: IMenuLink[] = [];
    links = [
      {
        page: <CourseMain courseProps={course} />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
            <IconArticle color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.course.main,
        section: 'main',
      },
      {
        page: <CourseChatPage spec={spec} groupSpec={params.get('group')} />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
            <Messages color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.course.chat,
        section: 'chat',
      },
      {
        page: <Moderators type={'course'} spec={spec} isAuthor={isAuthor!} />,
        icon: <IconUserCog color="var(--secondary)" />,
        title: locale.dashboard.course.moderators,
        section: 'moderators',
      },
      {
        page: (
          <CourseParticipants type={'course'} spec={spec} allParticipants />
        ),
        icon: <IconList color="var(--secondary)" />,
        title: locale.dashboard.course.allParticipants,
        section: 'all_participants',
      },
      {
        page: <CourseParticipants type={'course'} spec={spec} />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.course.groupParticipants,
        section: 'participants',
      },
      {
        page: <CreateNotificationCourse spec={spec} type="course" />,
        icon: <IconBellPlus color="var(--secondary)" />,
        title: locale.dashboard.course.createNotification,
        section: 'create_notification',
      },
      {
        page: <GroupOpenness spec={spec} />,
        icon: <IconLockCog color="var(--secondary)" />,
        title: locale.dashboard.course.groupOpenness,
        section: 'group_openness',
      },
    ];

    if (isAuthor) {
      links = [
        ...links,
        {
          page: <Groups course_spec={spec} />,
          icon: <IconUsersGroup color="var(--secondary)" />,
          title: locale.dashboard.course.groups,
          section: 'groups',
        },
      ];
    }

    return links;
  }, [course, hasNewMessages, locale, refetch, spec, isAuthor, params]);

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
      {isAuthor !== null && <LeftMenu links={links} />}
      {user && <GroupSelectorMenu courseSpec={spec} user={user.login} />}
    </>
  );
};

export default memo(CourseDashboard);
