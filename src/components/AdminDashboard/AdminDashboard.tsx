import AssignmentList from '@components/Profile/AssignmentList/AssignmentList';
import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useLocale } from '@hooks/useLocale';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { FC, memo, useMemo } from 'react';
import {
  IconAB2,
  IconAlphabetCyrillic,
  IconChalkboard,
  IconPlaylistAdd,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react';

import AddGrade from './AddGrade/AddGrade';
import AddGrades from './AddGrades/AddGrades';
import AddUser from './AddUser/AddUser';
import AddUsers from './AddUsers/AddUsers';
import ChangeGrades from './ChangeGrades/ChangeGrades';

const AdminDashboard: FC<{}> = () => {
  const { locale } = useLocale();

  const links: IMenuLink[] = useMemo(
    () => [
      {
        page: <AssignmentList url="assignment/list" />,
        icon: <IconChalkboard color="var(--secondary)" />,
        title: locale.dashboard.admin.assignmentList,
        section: 'assignments',
      },
      {
        page: <AddUsers />,
        icon: <IconUsers color="var(--secondary)" />,
        title: locale.dashboard.admin.addUsers,
        section: 'add_users',
      },
      {
        page: <AddUser />,
        icon: <IconUserPlus color="var(--secondary)" />,
        title: locale.dashboard.admin.addUser,
        section: 'add_user',
      },
      {
        page: <AddGrade />,
        icon: <IconAlphabetCyrillic color="var(--secondary)" />,
        title: locale.dashboard.admin.addGrade,
        section: 'add_grade',
      },
      {
        page: <AddGrades />,
        icon: <IconPlaylistAdd color="var(--secondary)" />,
        title: locale.dashboard.admin.addGrades,
        section: 'add_grades',
      },
      {
        page: <ChangeGrades />,
        icon: <IconAB2 color="var(--secondary)" />,
        title: locale.dashboard.admin.changeGrades,
        section: 'change_grades',
      },
    ],
    [locale]
  );
  return <LeftMenu links={links} />;
};

export default memo(AdminDashboard);
