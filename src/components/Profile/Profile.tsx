"use client";

import NotificationList from "@components/Notification/List/NotificationList";
import AssignmentList from "@components/Profile/AssignmentList/AssignmentList";
import AttemptListProfile from "@components/Profile/AttemptListProfile/AttemptListProfile";
import CreateNotification from "@components/Profile/CreateNotification/CreateNotification";
import ProfileInfo from "@components/Profile/ProfileInfo/ProfileInfo";
import Settings from "@components/Profile/Settings/Settings";
import { IFullProfileBundle } from "@custom-types/data/IProfileInfo";
import { useBackNotifications } from "@hooks/useBackNotifications";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { Indicator, UserAvatar } from "@ui/basics";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import { useSearchParams } from "next/navigation";
import { FC, memo, useMemo } from "react";
import {
  IconAlignRight,
  IconBellPlus,
  IconBellRinging,
  IconChalkboard,
  IconRobot,
  IconSettings as SettingsIcon,
} from "@tabler/icons-react";

import styles from "./profile.module.css";
import { LoadingOverlay } from "@mantine/core";

const Profile: FC<IFullProfileBundle> = ({
  user,
  attempt_info,
  task_info,
  rating_info,
}) => {
  const { unviewed } = useBackNotifications();
  const { locale } = useLocale();
  const { isTeacher } = useUser();
  const searchParams = useSearchParams();

  const links = useMemo(() => {
    const base = [
      {
        icon: <IconRobot color="var(--secondary)" />,
        title: locale.profile.profile,
        section: "profile",
      },
      {
        icon: (
          <Indicator disabled={unviewed <= 0} size={8}>
            <IconBellRinging color="var(--secondary)" />
          </Indicator>
        ),
        title: locale.profile.notification,
        section: "notifications",
      },
      {
        icon: <IconChalkboard color="var(--secondary)" />,
        title: locale.profile.assignments,
        section: "assignments",
      },
      {
        icon: <IconAlignRight color="var(--secondary)" />,
        title: locale.profile.attempts,
        section: "attempts",
      },
    ];

    if (isTeacher) {
      base.push({
        icon: <IconBellPlus color="var(--secondary)" />,
        title: locale.profile.createNotification,
        section: "create_notification",
      });
    }

    base.push({
      icon: <SettingsIcon color="var(--secondary)" />,
      title: locale.profile.settings,
      section: "settings",
    });

    return base;
  }, [locale, unviewed, isTeacher]);

  const currentSection = searchParams?.get("section") || links[0].section;

  const renderActivePage = () => {
    switch (currentSection) {
      case "profile":
        return (
          <ProfileInfo
            user={user}
            attempt_info={attempt_info}
            task_info={task_info}
            rating_info={rating_info}
          />
        );
      case "notifications":
        return <NotificationList />;
      case "assignments":
        return <AssignmentList />;
      case "attempts":
        return <AttemptListProfile />;
      case "create_notification":
        return isTeacher ? <CreateNotification /> : null;
      case "settings":
        return <Settings user={user} />;
      default:
        return <LoadingOverlay visible loaderProps={{ radius: "lg" }} />;
    }
  };

  return (
    <LeftMenu
      links={links}
      topContent={
        <div className={styles.header}>
          <UserAvatar login={user.login} />
          <div className={styles.shortInfo}>
            <div className={styles.shortName}>{user.shortName}</div>
            <div className={styles.login}>{user.login}</div>
          </div>
        </div>
      }
    >
      {renderActivePage()}
    </LeftMenu>
  );
};

export default memo(Profile);
