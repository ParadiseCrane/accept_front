"use client";

import DeleteModal from "@components/Course/DeleteModal/DeleteModal";
import { useChatHosts } from "@hooks/useChatHosts";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { Indicator, Tip } from "@ui/basics";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import { FC, memo, useMemo, useState } from "react";
import {
  IconMessages,
  IconUsers,
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
import { useRouter, useSearchParams } from "next/navigation";
import Sticky, { IStickyAction } from "@ui/Sticky/Sticky";
import { IMenuLink } from "@custom-types/ui/IMenuLink";

const CourseDashboard: FC<{
  course: ICourse;
  courseSpec: string;
  isAuthor: boolean;
}> = ({ course, courseSpec, isAuthor }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const { isTeacher } = useUser();
  const { hasNewMessages } = useChatHosts();

  const [activeModal, setActiveModal] = useState(false);

  const links = useMemo((): IMenuLink[] => {
    const base = [
      {
        icon: <IconArticle color="var(--secondary)" />,
        title: locale.dashboard.course.main,
        section: "main",
      },
      {
        icon: (
          <Indicator
            size={20}
            disabled={!hasNewMessages}
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
        icon: <IconUserCog color="var(--secondary)" />,
        title: locale.dashboard.course.moderators,
        section: "moderators",
      },
      {
        icon: <IconUsers color="var(--secondary)" />,
        title: locale.dashboard.course.groupParticipants,
        section: "participants",
      },
      {
        icon: <IconBellPlus color="var(--secondary)" />,
        title: locale.dashboard.course.createNotification,
        section: "create_notification",
      },
      {
        icon: <IconLockCog color="var(--secondary)" />,
        title: locale.dashboard.course.courseAccess,
        section: "access",
      },
    ];

    if (isAuthor) {
      base.splice(3, 0, {
        icon: <IconList color="var(--secondary)" />,
        title: locale.dashboard.course.allParticipants,
        section: "all_participants",
      });
      base.push({
        icon: <IconUsersGroup color="var(--secondary)" />,
        title: locale.dashboard.course.groups,
        section: "groups",
      });
    }

    return base;
  }, [hasNewMessages, locale, isAuthor]);

  const currentSection = searchParams?.get("section") || links[0].section;

  const renderActivePage = () => {
    switch (currentSection) {
      case "main":
        return <CourseMain course={course} />;
      case "chat":
        return <CourseChatPage spec={course.spec} />;
      case "moderators":
        return (
          <Moderators type="course" spec={course.spec} isAuthor={isAuthor} />
        );
      case "participants":
        return <CourseParticipants type="course" spec={course.spec} />;
      case "all_participants":
        return (
          <CourseParticipants
            type="course"
            spec={course.spec}
            allParticipants
          />
        );
      case "create_notification":
        return <CreateNotificationCourse spec={course.spec} type="course" />;
      case "access":
        return <GroupOpenness spec={course.spec} />;
      case "groups":
        return <Groups course_spec={course.spec} />;
      default:
        return <CourseMain course={course} />;
    }
  };

  const actions: IStickyAction[] = useMemo(() => {
    if (!isAuthor) return [];
    return [
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
    ];
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
      >
        {renderActivePage()}
      </LeftMenu>
    </>
  );
};

export default memo(CourseDashboard);
