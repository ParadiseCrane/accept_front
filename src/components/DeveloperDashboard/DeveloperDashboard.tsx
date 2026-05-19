"use client";

import { useLocale } from "@hooks/useLocale";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import { FC, memo, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  IconBellRinging,
  IconDeviceAnalytics,
  IconListDetails,
  IconTerminal,
  IconTestPipe,
  IconTestPipe2,
  IconUserExclamation,
} from "@tabler/icons-react";

import AllAttempts from "./AllAttempts/AllAttempts";
import Analytics from "./Analytics/Analytics";
import CurrentAttempts from "./CurrentAttempts/CurrentAttempts";
import Executor from "./Executor/Executor";
import FeedbackList from "./FeedbackList/FeedbackList";
import NotificationList from "./NotificationList/NotificationList";
import Organizations from "./Organizations/Organizations";
import { LoadingOverlay } from "@mantine/core";

const DeveloperDashboard: FC<{}> = () => {
  const { locale } = useLocale();
  const searchParams = useSearchParams();

  const links = useMemo(
    () => [
      {
        icon: <IconUserExclamation color="var(--secondary)" />,
        title: locale.dashboard.developer.feedbackList,
        section: "feedback",
      },
      {
        icon: <IconTestPipe color="var(--secondary)" />,
        title: locale.dashboard.developer.currentAttempts.title,
        section: "current_attempts",
      },
      {
        icon: <IconTestPipe2 color="var(--secondary)" />,
        title: locale.dashboard.developer.allAttempts,
        section: "all_attempts",
      },
      {
        icon: <IconBellRinging color="var(--secondary)" />,
        title: locale.dashboard.developer.notificationList,
        section: "notifications",
      },
      {
        icon: <IconListDetails color="var(--secondary)" />,
        title: locale.dashboard.developer.organizationList,
        section: "organizations",
      },
      {
        icon: <IconTerminal color="var(--secondary)" />,
        title: locale.dashboard.developer.executor,
        section: "executor",
      },
      {
        icon: <IconDeviceAnalytics color="var(--secondary)" />,
        title: locale.dashboard.developer.analytics.title,
        section: "analytics",
      },
    ],
    [locale],
  );

  const currentSection = searchParams?.get("section");

  const renderActivePage = () => {
    switch (currentSection) {
      case "feedback":
        return <FeedbackList />;
      case "current_attempts":
        return <CurrentAttempts />;
      case "all_attempts":
        return <AllAttempts />;
      case "notifications":
        return <NotificationList />;
      case "organizations":
        return <Organizations />;
      case "executor":
        return <Executor />;
      case "analytics":
        return <Analytics />;
      default:
        return <LoadingOverlay visible loaderProps={{ radius: "lg" }} />;
    }
  };

  return <LeftMenu links={links}>{renderActivePage()}</LeftMenu>;
};

export default memo(DeveloperDashboard);
