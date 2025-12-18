import { IProfileMenuLink } from "@custom-types/ui/IHeaderLink";
import NotificationIcon from "@ui/NotificationIcon/NotificationIcon";
import {
  IconCrown,
  IconGlassFull,
  IconMailOpened,
  IconRobot,
} from "@tabler/icons-react";

export const menuLinks: IProfileMenuLink[] = [
  {
    text: (locale) => locale.mainHeaderLinks.profileLinks.profile,
    icon: <IconRobot color="var(--secondary)" size={20} />,
    href: "/profile/me",
  },
  {
    text: (locale) => locale.mainHeaderLinks.profileLinks.notifications,
    icon: <NotificationIcon />,
    href: "/profile/me?section=notifications",
  },
  {
    text: (locale) => locale.mainHeaderLinks.profileLinks.adminDashboard,
    icon: <IconCrown color="var(--secondary)" size={20} />,
    href: "/dashboard/admin",
    permission: "admin",
  },
  {
    text: (locale) => locale.mainHeaderLinks.profileLinks.developerDashboard,
    icon: <IconGlassFull color="var(--secondary)" size={20} />,
    href: "/dashboard/developer",
    permission: "developer",
  },
  {
    text: (locale) => locale.mainHeaderLinks.profileLinks.feedback,
    icon: <IconMailOpened color="var(--secondary)" size={20} />,
    href: "/feedback",
  },
];
