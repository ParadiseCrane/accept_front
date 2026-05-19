import AssignmentList from "@components/Profile/AssignmentList/AssignmentList";
import { IMenuLink } from "@custom-types/ui/IMenuLink";
import { useLocale } from "@hooks/useLocale";
import LeftMenu from "@ui/LeftMenu/LeftMenu";
import { FC, memo, useMemo } from "react";
import {
  IconAB2,
  IconAlphabetCyrillic,
  IconChalkboard,
  IconPlaylistAdd,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";

import AddGrade from "./AddGrade/AddGrade";
import AddGrades from "./AddGrades/AddGrades";
import AddUser from "./AddUser/AddUser";
import AddUsers from "./AddUsers/AddUsers";
import ChangeGrades from "./ChangeGrades/ChangeGrades";
import { useSearchParams } from "next/navigation";
import { LoadingOverlay } from "@mantine/core";

const AdminDashboard: FC<{}> = () => {
  const { locale } = useLocale();

  const searchParams = useSearchParams();

  const links: IMenuLink[] = useMemo(
    (): IMenuLink[] => [
      {
        icon: <IconChalkboard color="var(--secondary)" />,
        title: locale.dashboard.admin.assignmentList,
        section: "assignments",
      },
      {
        icon: <IconUsers color="var(--secondary)" />,
        title: locale.dashboard.admin.addUsers,
        section: "add_users",
      },
      {
        icon: <IconUserPlus color="var(--secondary)" />,
        title: locale.dashboard.admin.addUser,
        section: "add_user",
      },
      {
        icon: <IconAlphabetCyrillic color="var(--secondary)" />,
        title: locale.dashboard.admin.addGrade,
        section: "add_grade",
      },
      {
        icon: <IconPlaylistAdd color="var(--secondary)" />,
        title: locale.dashboard.admin.addGrades,
        section: "add_grades",
      },
      {
        icon: <IconAB2 color="var(--secondary)" />,
        title: locale.dashboard.admin.changeGrades,
        section: "change_grades",
      },
    ],
    [locale],
  );

  const currentSection = searchParams?.get("section");

  const renderActivePage = () => {
    switch (currentSection) {
      case "assignments":
        return <AssignmentList url="assignment/list" />;
      case "add_users":
        return <AddUsers />;
      case "add_user":
        return <AddUser />;
      case "add_grade":
        return <AddGrade />;
      case "add_grades":
        return <AddGrades />;
      case "change_grades":
        return <ChangeGrades />;
      default:
        return <LoadingOverlay visible loaderProps={{ radius: "lg" }} />;
    }
  };

  return <LeftMenu links={links}>{renderActivePage()}</LeftMenu>;
};

export default memo(AdminDashboard);
