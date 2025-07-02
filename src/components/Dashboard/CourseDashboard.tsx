import DeleteModal from '@components/Course/DeleteModal/DeleteModal';
import { STICKY_SIZES } from '@constants/Sizes';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useChatHosts } from '@hooks/useChatHosts';
import { useLocale } from '@hooks/useLocale';
import { useUser } from '@hooks/useUser';
import { Indicator, Tip } from '@ui/basics';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { FC, memo, useMemo, useState } from 'react';
import { Messages, Users } from 'tabler-icons-react';
import {
  IconUsersGroup,
  IconUserCog,
  IconArticle,
  IconList,
  IconBellPlus,
  IconLockCog,
  IconArrowLeft,
} from '@tabler/icons-react';

import { ICourse } from '@custom-types/data/ICourse';
import Moderators from './Moderators/Moderators';
import GroupSelectorMenu from './GroupSelector/GroupSelector';
import CourseParticipants from '@components/Dashboard/CourseParticipants/CourseParticipants';
import CourseMain from './CourseMain/CourseMain';
import Groups from './Groups/Groups';
import CreateNotificationCourse from './CreateNotificationCourse/CreateNotificationCourse';
import CourseChatPage from './CourseChatPage/CourseChatPage';
import GroupOpenness from './GroupOpenness/GroupOpenness';
import { tooltipOpenDelay } from '@constants/Duration';
import styles from './dashboard.module.css';
import { useRouter } from 'next/router';

const CourseDashboard: FC<{
  course: ICourse;
  courseSpec: string;
  isAuthor: boolean;
}> = ({ course, courseSpec, isAuthor }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { user } = useUser();

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
        page: <CourseChatPage spec={course.spec} />,
        icon: (
          <Indicator size={10} disabled={!hasNewMessages} blink>
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
      {
        page: <GroupOpenness spec={course.spec} />,
        icon: <IconLockCog color="var(--secondary)" />,
        title: locale.dashboard.course.courseAccess,
        section: 'access',
      },
    ];

    if (isAuthor) {
      links = [
        ...links,
        {
          page: <Groups course_spec={course.spec} />,
          icon: <IconUsersGroup color="var(--secondary)" />,
          title: locale.dashboard.course.groups,
          section: 'groups',
        },
      ];
      links.splice(3, 0, {
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
  }, [hasNewMessages, locale, course, isAuthor]);

  const [activeModal, setActiveModal] = useState(false);

  const { isTeacher } = useUser();

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
        </>
      )}
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
      {user && <GroupSelectorMenu courseSpec={course.spec} user={user.login} />}
    </>
  );
};

export default memo(CourseDashboard);
