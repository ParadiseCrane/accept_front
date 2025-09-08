'use client';
import { IUserDisplay } from '@custom-types/data/IUser';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import tableStyles from '@styles/ui/customTable.module.css';
import { capitalize } from '@utils/capitalize';
import Link from 'next/link';
import { FC, memo, useCallback } from 'react';

import styles from './style.module.css';
import SimpleUserList from '../../ui/SimpleUserList/SimpleUserList';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@ui/basics';

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
    size: 4,
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
    size: 8,
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

const refactorUser = (user: IUserDisplay): any => ({
  ...user,
  login: {
    value: user.login,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link href={`/profile/${user.login}`} className={tableStyles.title}>
          {user.login}
        </Link>
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
          color: user.role.accessLevel > 50 ? 'var(--accent)' : 'black',
        }}
      >
        {capitalize(user.role.name)}
      </div>
    ),
  },
});

const EmptyTableComponent: FC<{
  title: string;
  buttonTitle: string;
  redirectTo: string;
}> = ({ title, buttonTitle, redirectTo }) => {
  const router = useRouter();
  const redirect = useCallback(
    () => router.push(redirectTo),
    [redirectTo, router]
  );

  return (
    <>
      {title}
      <Button onClick={redirect}>{buttonTitle}</Button>
    </>
  );
};

const CourseParticipants: FC<{
  type: 'course';
  spec: string;
  allParticipants?: boolean;
}> = ({ type, spec, allParticipants }) => {
  const { locale } = useLocale();
  const searchParams = useSearchParams();
  const groupSpec = searchParams && searchParams.get('group');
  const isGroupSelected = groupSpec !== 'all';
  const groupSpecForRequest = allParticipants ? 'all' : groupSpec;

  return (
    <div className={styles.wrapper}>
      <SimpleUserList
        url={`${type}/participant/${spec}/${groupSpecForRequest}`}
        refactorUser={refactorUser}
        initialColumns={initialColumns}
        noDefault
        emptyTableComponent={
          isGroupSelected ? (
            <EmptyTableComponent
              title={locale.dashboard.course.noParticipantsFound}
              buttonTitle={locale.dashboard.course.editGroup}
              redirectTo={`/group/edit/${groupSpec}`}
            />
          ) : (
            <EmptyTableComponent
              title={locale.dashboard.course.noGroupsFound}
              buttonTitle={locale.group.add}
              redirectTo={`/group/add?course=${spec}`}
            />
          )
        }
        classNames={{
          wrapper: tableStyles.wrapper,
          table: tableStyles.table,
          headerCell: styles.headerCell,
          cell: styles.cell,
          even: tableStyles.even,
          odd: tableStyles.odd,
        }}
      />
    </div>
  );
};

export default memo(CourseParticipants);
