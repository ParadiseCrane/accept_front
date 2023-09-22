import { ITableColumn } from '@custom-types/ui/ITable';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactNode } from 'react';
import tableStyles from '@styles/ui/customTable.module.css';
import { ILocale } from '@custom-types/ui/ILocale';
import { IUser } from '@custom-types/data/IUser';
import { capitalize } from '@utils/capitalize';
import UserList from '@ui/UserList/UserList';
import { accessLevels } from '@constants/protectedRoutes';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';
import Link from 'next/link';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.users.list.login,
    key: 'login',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.login.value > b.login.value
        ? 1
        : a.login.value == b.login.value
        ? 0
        : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 8,
  },
  {
    label: locale.users.list.shortName,
    key: 'shortName',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.shortName.value > b.shortName.value
        ? 1
        : a.shortName.value == b.shortName.value
        ? 0
        : -1;
    },
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 3,
  },
  {
    label: locale.users.list.role,
    key: 'role',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.role.value.spec > b.role.value.spec
        ? 1
        : a.role.value.spec == b.role.value.spec
        ? 0
        : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 2,
  },
];

const refactorUser = (user: IUser): any => ({
  ...user,
  login: {
    value: user.login,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link
          className={tableStyles.title}
          href={`/profile/${user.login}`}
        >
          {user.login}
        </Link>
        {user.groups.length > 0 && (
          <span className={tableStyles.tags}>
            {user.groups.map((group, idx) => (
              <div className={tableStyles.tag} key={idx}>
                {group.name +
                  (idx == user.groups.length - 1 ? '' : ', ')}
              </div>
            ))}
          </span>
        )}
      </div>
    ),
  },
  shortName: {
    value: user.shortName,
    display: user.shortName,
  },
  role: {
    value: user.role,
    display: (
      <div
        style={{
          color:
            user.role.accessLevel >= accessLevels.admin
              ? 'var(--accent)'
              : 'black',
        }}
      >
        {capitalize(user.role.name)}
      </div>
    ),
  },
});

function UsersListPage() {
  const { locale } = useLocale();
  return (
    <>
      <Title title={locale.titles.user.list} />
      <UserList
        url={'user/listBundle'}
        refactorUser={refactorUser}
        initialColumns={initialColumns}
      />
    </>
  );
}

UsersListPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default UsersListPage;
