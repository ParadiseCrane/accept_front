"use client";

import DeleteModal from "@components/Course/DeleteModal/DeleteModal";
import { IMenuLink } from "@custom-types/ui/IMenuLink";
import { useChatHosts } from "@hooks/useChatHosts";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { Indicator, Tip } from "@ui/basics";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import { FC, memo, useMemo, useState } from "react";
import { IconMessages, IconUsers } from "@tabler/icons-react";
import {
  IconUsersGroup,
  IconUserCog,
  IconArticle,
  IconList,
  IconBellPlus,
  IconLockCog,
  IconArrowLeft,
  IconTrash,
  IconPencil,
} from "@tabler/icons-react";

import { ICourse } from "@custom-types/data/ICourse";
import Moderators from "./Moderators/Moderators";
import CourseParticipants from "@components/Dashboard/CourseParticipants/CourseParticipants";
import CourseMain from "./CourseMain/CourseMain";
import Groups from "./Groups/Groups";
import CreateNotificationCourse from "./CreateNotificationCourse/CreateNotificationCourse";
import CourseChatPage from "./CourseChatPage/CourseChatPage";
import GroupOpenness from "./GroupOpenness/GroupOpenness";
import { tooltipOpenDelay } from "@constants/Duration";
import styles from "./dashboard.module.css";
import { useRouter } from "next/navigation";
import Sticky, { IStickyAction } from "@ui/Sticky/Sticky";

const CourseDashboard: FC<{
  course: ICourse;
  courseSpec: string;
  isAuthor: boolean;
}> = ({ course, courseSpec, isAuthor }) => {
  const router = useRouter();
  const { locale } = useLocale();

  const [activeModal, setActiveModal] = useState(false);

  const { isTeacher } = useUser();

  const { hasNewMessages } = useChatHosts();

  const links: IMenuLink[] = useMemo(() => {
    let links: IMenuLink[] = [];
    links = [
      {
        page: <CourseMain course={course} />,
        icon: <IconArticle color="var(--secondary)" />,
        title: locale.dashboard.course.main,
        section: "main",
      },
      {
        page: <CourseChatPage spec={course.spec} />,
        icon: (
          <Indicator
            size={20}
            disabled={false}
            offset={0}
            zIndex={100}
            processing
            color="var(--accent)"
            label={"New"}
          >
            <IconMessages color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.dashboard.course.chat,
        section: "chat",
      },
      {
        page: (
          <Moderators type={"course"} spec={course.spec} isAuthor={isAuthor} />
        ),
        icon: <IconUserCog color="var(--secondary)" />,
        title: locale.dashboard.course.moderators,
        section: "moderators",
      },
      {
        page: <CourseParticipants type={"course"} spec={course.spec} />,
        icon: <IconUsers color="var(--secondary)" />,
        title: locale.dashboard.course.groupParticipants,
        section: "participants",
      },
      {
        page: <CreateNotificationCourse spec={course.spec} type="course" />,
        icon: <IconBellPlus color="var(--secondary)" />,
        title: locale.dashboard.course.createNotification,
        section: "create_notification",
      },
      {
        page: <GroupOpenness spec={course.spec} />,
        icon: <IconLockCog color="var(--secondary)" />,
        title: locale.dashboard.course.courseAccess,
        section: "access",
      },
    ];

    if (isAuthor) {
      links = [
        ...links,
        {
          page: <Groups course_spec={course.spec} />,
          icon: <IconUsersGroup color="var(--secondary)" />,
          title: locale.dashboard.course.groups,
          section: "groups",
        },
      ];
      links.splice(3, 0, {
        page: (
          <CourseParticipants
            type={"course"}
            spec={course.spec}
            allParticipants
          />
        ),
        icon: <IconList color="var(--secondary)" />,
        title: locale.dashboard.course.allParticipants,
        section: "all_participants",
      });
    }

    return links;
  }, [hasNewMessages, locale, course, isAuthor]);

  const actions: IStickyAction[] = useMemo(() => {
    const innerActions: IStickyAction[] = [];

    if (isAuthor) {
      innerActions.push(
        {
          color: "green",
          href: `/course/${courseSpec}/edit/${courseSpec}`,
          icon: <IconPencil height={20} width={20} />,
          description: locale.tip.sticky.course.edit("course"),
        },
        {
          color: "red",
          onClick: () => setActiveModal(true),
          icon: <IconTrash height={20} width={20} />,
          description: locale.tip.sticky.course.delete,
        },
      );
    }

    return innerActions;
  }, [isAuthor, locale, courseSpec]);

  return (
    <>
      {actions.length > 0 && isAuthor && <Sticky actions={actions} />}
      {isTeacher && isAuthor && course && (
        <DeleteModal
          active={activeModal}
          setActive={setActiveModal}
          course={course}
        />
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
            <IconArrowLeft color={"var(--primary)"} />
            <div className={styles.title}>
              {locale.course.backToCourseButton}
            </div>
          </Tip>
        }
      />
    </>
  );
};

export default memo(CourseDashboard);
