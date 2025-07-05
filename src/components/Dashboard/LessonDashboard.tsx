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
} from '@tabler/icons-react';

import { ILesson } from '@custom-types/data/ICourse';
import GroupSelectorMenu from './GroupSelector/GroupSelector';
import CourseParticipants from '@components/Dashboard/CourseParticipants/CourseParticipants';
import CreateNotificationCourse from './CreateNotificationCourse/CreateNotificationCourse';
import CourseChatPage from './CourseChatPage/CourseChatPage';
import { tooltipOpenDelay } from '@constants/Duration';
import styles from './dashboard.module.css';
import { useRouter } from 'next/router';
import LessonMain from './LessonMain/LessonMain';

const LessonDashboard: FC<{
  lesson: ILesson;
  courseSpec: string;
  isAuthor: boolean;
}> = ({ lesson, courseSpec, isAuthor }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { user } = useUser();

  const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    let links: IMenuLink[] = [];
    links = [
      {
        page: <LessonMain lessonProps={lesson} />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
            <IconArticle color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.course.main,
        section: 'main',
      },
      {
        page: <CourseChatPage spec={lesson.spec} entity="lesson" />,
        icon: (
          <Indicator size={10} disabled blink>
            <Messages color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.course.chat,
        section: 'chat',
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
  }, [lesson, locale, hasNewMessages, courseSpec]);

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

export default memo(LessonDashboard);
