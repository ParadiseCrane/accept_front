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

import { ICourse, ILesson } from '@custom-types/data/ICourse';
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

const LessonDashboard: FC<{
  lesson: ILesson;
  courseSpec: string;
  isAuthor: boolean;
}> = ({ lesson, courseSpec, isAuthor }) => {
  const router = useRouter();
  const { locale } = useLocale();
  const { user } = useUser();
  const params = useSearchParams();

  // const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    let links: IMenuLink[] = [];
    links = [
      // {
      //   page: <CourseMain courseProps={lesson} />,
      //   icon: (
      //     <Indicator size={10} disabled blink>
      //       <IconArticle color="var(--secondary)" />
      //     </Indicator>
      //   ),
      //   title: locale.dashboard.course.main,
      //   section: 'main',
      // },
      // {
      //   page: (
      //     <CourseChatPage spec={lesson.spec} />
      //   ),
      //   icon: (
      //     <Indicator size={10} disabled blink>
      //       <Messages color="var(--secondary)" />
      //     </Indicator>
      //   ),
      //   title: locale.dashboard.course.chat,
      //   section: 'chat',
      // },
      {
        page: (
          <Moderators type={'course'} spec={lesson.spec} isAuthor={isAuthor!} />
        ),
        icon: <IconUserCog color="var(--secondary)" />,
        title: locale.dashboard.course.moderators,
        section: 'moderators',
      },
      {
        page: (
          <CourseParticipants
            type={'course'}
            spec={lesson.spec}
            allParticipants
          />
        ),
        icon: <IconList color="var(--secondary)" />,
        title: locale.dashboard.course.allParticipants,
        section: 'all_participants',
      },
      {
        page: <CourseParticipants type={'course'} spec={lesson.spec} />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.course.groupParticipants,
        section: 'participants',
      },
      {
        page: <CreateNotificationCourse spec={lesson.spec} type="course" />,
        icon: <IconBellPlus color="var(--secondary)" />,
        title: locale.dashboard.course.createNotification,
        section: 'create_notification',
      },
      {
        page: <GroupOpenness spec={lesson.spec} />,
        icon: <IconLockCog color="var(--secondary)" />,
        title: locale.dashboard.course.courseAccess,
        section: 'access',
      },
    ];

    if (isAuthor) {
      links = [
        ...links,
        {
          page: <Groups course_spec={lesson.spec} />,
          icon: <IconUsersGroup color="var(--secondary)" />,
          title: locale.dashboard.course.groups,
          section: 'groups',
        },
      ];
    }

    return links;
  }, [lesson, locale, isAuthor, params]);

  const [activeModal, setActiveModal] = useState(false);

  const { isTeacher } = useUser();
  const { width } = useWidth();

  // const actions: IStickyAction[] = [
  //   {
  //     color: 'green',
  //     icon: (
  //       <Pencil
  //         width={STICKY_SIZES[width] / 3}
  //         height={STICKY_SIZES[width] / 3}
  //       />
  //     ),
  //     href: `/course/edit/${spec}`,
  //     description: locale.tip.sticky.course.edit,
  //   },
  //   {
  //     color: 'red',
  //     icon: (
  //       <Trash
  //         width={STICKY_SIZES[width] / 3}
  //         height={STICKY_SIZES[width] / 3}
  //       />
  //     ),
  //     onClick: () => setActiveModal(true),
  //     description: locale.tip.sticky.course.delete,
  //   },
  // ];

  return (
    <>
      {isTeacher && (
        <>
          {/* {course && (
            <DeleteModal
              active={activeModal}
              setActive={setActiveModal}
              course={course}
            />
          )}
          <Sticky actions={actions} /> */}
        </>
      )}
      {isAuthor !== null && (
        // <></>
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
      )}
      {user && <GroupSelectorMenu courseSpec={lesson.spec} user={user.login} />}
    </>
  );
};

export default memo(LessonDashboard);
