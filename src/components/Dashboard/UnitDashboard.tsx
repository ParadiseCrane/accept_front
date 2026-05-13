"use client";

import { useChatHosts } from "@hooks/useChatHosts";
import { useLocale } from "@hooks/useLocale";
import { Indicator, Tip } from "@ui/basics";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import { FC, memo, useMemo } from "react";
import { IconMessages, IconUsers } from "@tabler/icons-react";
import {
  IconArticle,
  IconList,
  IconBellPlus,
  IconArrowLeft,
  IconLockCog,
  IconUserCog,
} from "@tabler/icons-react";

import { IUnit } from "@custom-types/data/ICourse";
import CourseParticipants from "@components/Dashboard/CourseParticipants/CourseParticipants";
import CreateNotificationCourse from "./CreateNotificationCourse/CreateNotificationCourse";
import CourseChatPage from "./CourseChatPage/CourseChatPage";
import { tooltipOpenDelay } from "@constants/Duration";
import styles from "./dashboard.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import UnitMain from "./UnitMain/UnitMain";
import GroupOpenness from "./GroupOpenness/GroupOpenness";
import Moderators from "./Moderators/Moderators";
import { IMenuLink } from "@custom-types/ui/IMenuLink";

const UnitDashboard: FC<{
  unit: IUnit;
  courseSpec: string;
  isAuthor: boolean;
}> = ({ unit, courseSpec, isAuthor }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  // const { hasNewMessages } = useChatHosts();

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
            disabled
            size={20}
            inline
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
      base.splice(2, 0, {
        icon: <IconList color="var(--secondary)" />,
        title: locale.dashboard.course.allParticipants,
        section: "all_participants",
      });
    }

    return base;
  }, [locale, isAuthor]);

  const currentSection = searchParams?.get("section") || links[0].section;

  const renderActivePage = () => {
    switch (currentSection) {
      case "main":
        return <UnitMain unitProps={unit} />;
      case "chat":
        return <CourseChatPage spec={courseSpec} entity="course" />;
      case "moderators":
        return (
          <Moderators type="course" spec={courseSpec} isAuthor={isAuthor} />
        );
      case "participants":
        return <CourseParticipants type="course" spec={courseSpec} />;
      case "all_participants":
        return (
          <CourseParticipants type="course" spec={courseSpec} allParticipants />
        );
      case "create_notification":
        return <CreateNotificationCourse spec={courseSpec} type="course" />;
      case "access":
        return <GroupOpenness spec={unit.spec} />;
      default:
        return <UnitMain unitProps={unit} />;
    }
  };

  return (
    <LeftMenu
      links={links}
      topContent={
        <Tip
          label={locale.course.backToCourseTip}
          openDelay={tooltipOpenDelay}
          position="top"
          spanStyle={styles.backToCoursesWrapper}
          onClick={() => router.push(`/course/${courseSpec}?item=${unit.spec}`)}
        >
          <IconArrowLeft color={"var(--primary)"} />
          <div className={styles.title}>{locale.course.backToCourseButton}</div>
        </Tip>
      }
    >
      {renderActivePage()}
    </LeftMenu>
  );
};

export default memo(UnitDashboard);
