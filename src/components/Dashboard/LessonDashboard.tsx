"use client";

import { useChatHosts } from "@hooks/useChatHosts";
import { useLocale } from "@hooks/useLocale";
import { Indicator, Tip } from "@ui/basics";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import { FC, memo, useMemo } from "react";
import { IconMessages, IconTable, IconUsers } from "@tabler/icons-react";
import {
  IconArticle,
  IconList,
  IconBellPlus,
  IconArrowLeft,
  IconUserCog,
} from "@tabler/icons-react";

import { ILesson } from "@custom-types/data/ICourse";
import CourseParticipants from "@components/Dashboard/CourseParticipants/CourseParticipants";
import CreateNotificationCourse from "./CreateNotificationCourse/CreateNotificationCourse";
import CourseChatPage from "./CourseChatPage/CourseChatPage";
import { tooltipOpenDelay } from "@constants/Duration";
import styles from "./dashboard.module.css";
import LessonMain from "./LessonMain/LessonMain";
import Moderators from "./Moderators/Moderators";
import { useCourse } from "@hooks/useCourse";
import { useRouter, useSearchParams } from "next/navigation";
import Results from "./Results/Results";
import { LoadingOverlay } from "@mantine/core";
import { IMenuLink } from "@custom-types/ui/IMenuLink";

const LessonDashboard: FC<{
  lesson: ILesson;
}> = ({ lesson }) => {
  const { locale } = useLocale();
  const { course, isAuthor } = useCourse();
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { hasNewMessages } = useChatHosts();

  const groupSpec = searchParams?.get("group") ?? undefined;
  const endDatePlaceholder = useMemo(() => new Date(2099, 1, 1), []);

  const links = useMemo((): IMenuLink[] => {
    if (!course) return [];

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
        icon: <IconTable color="var(--secondary)" />,
        title: locale.dashboard.course.results,
        section: "results",
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
    ];

    if (isAuthor) {
      base.splice(3, 0, {
        icon: <IconList color="var(--secondary)" />,
        title: locale.dashboard.course.allParticipants,
        section: "all_participants",
      });
    }

    return base;
  }, [locale, course, isAuthor]);

  const currentSection = searchParams?.get("section") || links[0].section;

  const renderActivePage = () => {
    if (!course)
      return <LoadingOverlay visible loaderProps={{ radius: "lg" }} />;

    switch (currentSection) {
      case "main":
        return <LessonMain lessonProps={lesson} />;
      case "chat":
        return <CourseChatPage spec={lesson.spec} entity="lesson" />;
      case "results":
        return (
          <Results
            spec={lesson.spec}
            isFinished={false}
            endDate={endDatePlaceholder}
            type={"lesson"}
            full
            is_team={false}
            groupSpec={groupSpec}
          />
        );
      case "moderators":
        return (
          <Moderators type={"course"} spec={course.spec} isAuthor={isAuthor} />
        );
      case "participants":
        return <CourseParticipants type={"course"} spec={course.spec} />;
      case "all_participants":
        return (
          <CourseParticipants
            type={"course"}
            spec={course.spec}
            allParticipants
          />
        );
      case "create_notification":
        return <CreateNotificationCourse spec={course.spec} type="course" />;
      default:
        return <LessonMain lessonProps={lesson} />;
    }
  };

  if (!course) return <LoadingOverlay visible loaderProps={{ radius: "lg" }} />;

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
          <IconArrowLeft color={"var(--primary)"} />
          <div className={styles.title}>{locale.course.backToCourseButton}</div>
        </Tip>
      }
    >
      {renderActivePage()}
    </LeftMenu>
  );
};

export default memo(LessonDashboard);
