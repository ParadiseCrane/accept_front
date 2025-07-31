'use client';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useChatHosts } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Indicator, Tip } from '@ui/basics';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { FC, memo, useMemo } from 'react';
import { Messages, Users } from 'tabler-icons-react';
import {
  IconArticle,
  IconList,
  IconBellPlus,
  IconArrowLeft,
  IconLockCog,
  IconUserCog,
} from '@tabler/icons-react';

import { IUnit } from '@custom-types/data/ICourse';
import { GroupSelectorMenu } from './GroupSelector/GroupSelector';
import CourseParticipants from '@components/Dashboard/CourseParticipants/CourseParticipants';
import CreateNotificationCourse from './CreateNotificationCourse/CreateNotificationCourse';
import CourseChatPage from './CourseChatPage/CourseChatPage';
import { tooltipOpenDelay } from '@constants/Duration';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';
import UnitMain from './UnitMain/UnitMain';
import GroupOpenness from './GroupOpenness/GroupOpenness';
import Moderators from './Moderators/Moderators';

const UnitDashboard: FC<{
  unit: IUnit;
  courseSpec: string;
  isAuthor: boolean;
}> = ({ unit, courseSpec, isAuthor }) => {
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
        page: <CourseChatPage spec={courseSpec} entity="course" />,
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
          <Moderators type={'course'} spec={courseSpec} isAuthor={isAuthor} />
        ),
        icon: <IconUserCog color="var(--secondary)" />,
        title: locale.dashboard.course.moderators,
        section: 'moderators',
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
      {
        page: <GroupOpenness spec={unit.spec} />,
        icon: <IconLockCog color="var(--secondary)" />,
        title: locale.dashboard.course.courseAccess,
        section: 'access',
      },
    ];

    if (isAuthor) {
      links.splice(2, 0, {
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
      });
    }

    return links;
  }, [unit, locale, hasNewMessages, courseSpec, isAuthor]);

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
            onClick={() =>
              router.push(`/course/${courseSpec}?item=${unit.spec}`)
            }
          >
            <IconArrowLeft color={'var(--primary)'} />
            <div className={styles.title}>
              {locale.course.backToCourseButton}
            </div>
          </Tip>
        }
      />
      {user && <GroupSelectorMenu courseSpec={courseSpec} />}
    </>
  );
};

export default memo(UnitDashboard);
