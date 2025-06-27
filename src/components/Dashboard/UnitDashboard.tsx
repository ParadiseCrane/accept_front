import DeleteModal from '@components/Course/DeleteModal/DeleteModal';
import { STICKY_SIZES } from '@constants/Sizes';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useChatHosts } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { useUser } from '@hooks/useUser';
import { useWidth } from '@hooks/useWidth';
import { useInterval } from '@mantine/hooks';
import { Indicator, Tip } from '@ui/basics';
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
  IconArrowLeft,
} from '@tabler/icons-react';

import { ICourse, IUnit } from '@custom-types/data/ICourse';
import Moderators from './Moderators/Moderators';
import GroupSelectorMenu from './GroupSelector/GroupSelector';
import CourseParticipants from '@components/Dashboard/CourseParticipants/CourseParticipants';
import CourseMain from './CourseMain/CourseMain';
import Groups from './Groups/Groups';
import { useSearchParams } from 'next/navigation';
import CreateNotificationCourse from './CreateNotificationCourse/CreateNotificationCourse';
import CourseChatPage from './CourseChatPage/CourseChatPage';
import GroupOpenness from './GroupOpenness/GroupOpenness';
import { tooltipOpenDelay } from '@constants/Duration';
import styles from './dashboard.module.css';
import { useRouter } from 'next/router';
import UnitMain from './UnitMain/UnitMain';

const UnitDashboard: FC<{
  unit: IUnit;
  courseSpec: string;
  isAuthor: boolean;
}> = ({ unit, courseSpec }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { user } = useUser();

  const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    let links: IMenuLink[] = [];
    links = [
      {
        page: <UnitMain unitProps={unit} />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
            <IconArticle color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.course.main,
        section: 'main',
      },
      {
        page: <CourseChatPage spec={courseSpec} />,
        icon: (
          <Indicator size={10} disabled blink>
            <Messages color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.course.chat,
        section: 'chat',
      },
      {
        page: (
          <CourseParticipants
            type={'course'}
            spec={courseSpec}
            allParticipants
          />
        ),
        icon: <IconList color="var(--secondary)" />,
        title: locale.dashboard.course.allParticipants,
        section: 'all_participants',
      },
      {
        page: <CourseParticipants type={'course'} spec={courseSpec} />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.course.groupParticipants,
        section: 'participants',
      },
      {
        page: <CreateNotificationCourse spec={courseSpec} type="course" />,
        icon: <IconBellPlus color="var(--secondary)" />,
        title: locale.dashboard.course.createNotification,
        section: 'create_notification',
      },
    ];

    return links;
  }, [unit, locale, hasNewMessages, courseSpec]);

  return (
    <>
      <LeftMenu
        links={links}
        topContent={
          <Tip
            label={locale.course.backToCourseTip}
            openDelay={tooltipOpenDelay}
            position="top"
            spanStyle={styles.backToCoursesWrapper}
            onClick={() => router.push(`/course/${courseSpec}`)}
          >
            <IconArrowLeft color={'var(--primary)'} />
            <div className={styles.title}>
              {locale.course.backToCourseButton}
            </div>
          </Tip>
        }
      />
      {user && <GroupSelectorMenu courseSpec={courseSpec} user={user.login} />}
    </>
  );
};

export default memo(UnitDashboard);
