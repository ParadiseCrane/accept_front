import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useLocale } from '@hooks/useLocale';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { FC, memo, useMemo } from 'react';
import {
  AB2,
  AlphabetCyrillic,
  Chalkboard,
  PlaylistAdd,
  UserPlus,
  Users,
} from 'tabler-icons-react';
import AddUsers from './AddUsers/AddUsers';
import AddUser from './AddUser/AddUser';
import AddGrade from './AddGrade/AddGrade';
import ChangeGrades from './ChangeGrades/ChangeGrades';
import AddGrades from './AddGrades/AddGrades';
import AssignmentList from '@components/Profile/AssignmentList/AssignmentList';

const AdminDashboard: FC<{}> = ({}) => {
  const { locale } = useLocale();

  const links: IMenuLink[] = useMemo(
    () => [
      {
        page: <AssignmentList url="assignment/list" />,
        icon: <Chalkboard color="var(--secondary)" />,
        title: locale.dashboard.admin.assignmentList,
        section: 'assignments',
      },
      {
        page: <AddUsers />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.admin.addUsers,
        section: 'add_users',
      },
      {
        page: <AddUser />,
        icon: <UserPlus color="var(--secondary)" />,
        title: locale.dashboard.admin.addUser,
        section: 'add_user',
      },
      {
        page: <AddGrade />,
        icon: <AlphabetCyrillic color="var(--secondary)" />,
        title: locale.dashboard.admin.addGrade,
        section: 'add_grade',
      },
      {
        page: <AddGrades />,
        icon: <PlaylistAdd color="var(--secondary)" />,
        title: locale.dashboard.admin.addGrades,
        section: 'add_grades',
      },
      {
        page: <ChangeGrades />,
        icon: <AB2 color="var(--secondary)" />,
        title: locale.dashboard.admin.changeGrades,
        section: 'change_grades',
      },
    ],
    [locale]
  );
  return <LeftMenu links={links} />;
};

export default memo(AdminDashboard);
