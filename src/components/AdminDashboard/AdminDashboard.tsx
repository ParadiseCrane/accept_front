import { IMenuLink } from '@custom-types/ui/IMenuLink';
import { useLocale } from '@hooks/useLocale';
import LeftMenu from '@ui/LeftMenu/LeftMenu';
import { FC, memo, useMemo } from 'react';
import { UserPlus, Users } from 'tabler-icons-react';
import AddUsers from './AddUsers/AddUsers';
import AddUser from './AddUser/AddUser';
import styles from './adminDashboard.module.css';

const AdminDashboard: FC<{}> = ({}) => {
  const { locale } = useLocale();

  const links: IMenuLink[] = useMemo(
    () => [
      {
        page: <AddUsers />,
        icon: <Users color="var(--secondary)" />,
        title: locale.dashboard.admin.addUsers,
      },
      {
        page: <AddUser />,
        icon: <UserPlus color="var(--secondary)" />,
        title: locale.dashboard.admin.addUser,
      },
    ],
    [locale]
  );
  return (
    <div className={styles.lol}>
      <LeftMenu links={links} />
    </div>
  );
};

export default memo(AdminDashboard);
