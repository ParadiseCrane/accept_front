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
  IconUserCog,
} from '@tabler/icons-react';

import { ILesson } from '@custom-types/data/ICourse';
import CourseParticipants from '@components/Dashboard/CourseParticipants/CourseParticipants';
import CreateNotificationCourse from './CreateNotificationCourse/CreateNotificationCourse';
import CourseChatPage from './CourseChatPage/CourseChatPage';
import { tooltipOpenDelay } from '@constants/Duration';
import styles from './dashboard.module.css';
import LessonMain from './LessonMain/LessonMain';
import Moderators from './Moderators/Moderators';
import { useCourse } from '@hooks/useCourse';
import { useRouter } from 'next/navigation';

const LessonDashboard: FC<{
  lesson: ILesson;
}> = ({ lesson }) => {
  const { locale } = useLocale();
  const { course, isAuthor } = useCourse();
  const router = useRouter();

  const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    if (!course) return [];
    let links: IMenuLink[] = [
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
        page: (
          <Moderators type={'course'} spec={course.spec} isAuthor={isAuthor} />
        ),
        icon: <IconUserCog color="var(--secondary)" />,
        title: locale.dashboard.course.moderators,
        section: 'moderators',
      },
      {
        page: <CourseParticipants type={'course'} spec={course.spec} />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.course.groupParticipants,
        section: 'participants',
      },
      {
        page: <CreateNotificationCourse spec={course.spec} type="course" />,
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
            spec={course.spec}
            allParticipants
          />
        ),
        icon: <IconList color="var(--secondary)" />,
        title: locale.dashboard.course.allParticipants,
        section: 'all_participants',
      });
    }

    return links;
  }, [lesson, locale, hasNewMessages, course, isAuthor]);

  if (!course) return null;

  return (
    <LeftMenu
      links={links}
      topContent={
        <Tip
          label={locale.course.backToCourseTip}
          openDelay={tooltipOpenDelay}
          position="top"
          spanStyle={styles.backToCoursesWrapper}
          onClick={() =>
            router.push(`/course/${course.spec}?item=${lesson.spec}`)
          }
        >
          <IconArrowLeft color={'var(--primary)'} />
          <div className={styles.title}>{locale.course.backToCourseButton}</div>
        </Tip>
      }
    />
  );
};

export default memo(LessonDashboard);
