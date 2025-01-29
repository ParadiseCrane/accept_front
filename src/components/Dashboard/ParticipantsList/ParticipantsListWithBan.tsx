import { IParticipant } from '@custom-types/data/IUser';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import tableStyles from '@styles/ui/customTable.module.css';
import { Helper } from '@ui/basics';
import UserList from '@ui/UserList/UserList';
import { capitalize } from '@utils/capitalize';
import Link from 'next/link';
import { FC, memo, useCallback, useState } from 'react';

import BanButton from './BanButton/BanButton';
import styles from './participantsList.module.css';

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
    size: 6,
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
    size: 4,
  },
  {
    label: '',
    key: 'banReason',
    sortable: false,
    sortFunction: (a: any, b: any): -1 | 0 | 1 =>
      a.value !== b.value ? 0 : a.value ? 1 : -1,
    sorted: 0,
    allowMiddleState: false,
    hidable: false,
    hidden: false,
    size: 1,
  },
  {
    label: locale.ban,
    key: 'ban',
    sortable: true,
    sortFunction: (a: any, b: any): -1 | 0 | 1 =>
      a.value !== b.value ? 0 : a.value ? 1 : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 4,
  },
];

const refactorUser = (
  locale: ILocale,
  type: 'assignment' | 'tournament',
  user: IParticipant,
  spec: string,
  handleBan: () => void
): any => ({
  ...user,
  login: {
    value: user.login,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link href={`/profile/${user.login}`} className={tableStyles.title}>
          {user.login}
        </Link>
        {user.groups.length > 0 && (
          <span className={tableStyles.tags}>
            {user.groups.map((group, idx) => (
              <div className={tableStyles.tag} key={idx}>
                {group.name + (idx == user.groups.length - 1 ? '' : ', ')}
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
          color: user.role.accessLevel > 50 ? 'var(--accent)' : 'black',
        }}
      >
        {capitalize(user.role.name)}
      </div>
    ),
  },
  ban: {
    value: user.banned,
    display: <BanButton user={user} spec={spec} onSuccess={handleBan} />,
  },
  banReason: {
    value: 0,
    display: (
      <div className={styles.banReason}>
        {user.banned && <Helper dropdownContent={user.banReason} />}
      </div>
    ),
  },
  team: {
    value: user.team?.name,
    display: (
      <>
        {user.team ? (
          <Link className={tableStyles.title} href={`/team/${user.team?.spec}`}>
            {user.team?.name}
          </Link>
        ) : (
          '-'
        )}
      </>
    ),
  },
});

const ParticipantsListWithBan: FC<{
  type: 'assignment' | 'tournament';
  team?: boolean;
  spec: string;
}> = ({ type, team, spec }) => {
  const { locale } = useLocale();
  const [refetch, setRefetch] = useState(false);

  const handleBan = useCallback(() => {
    setRefetch((val) => !val);
  }, []);

  const columns = useCallback((locale: ILocale) => {
    let columns = initialColumns(locale);
    return [
      ...columns.slice(0, 2),
      {
        label: locale.team.self,
        key: 'team',
        sortable: true,
        sortFunction: (a: any, b: any): -1 | 0 | 1 =>
          a.value !== b.value ? 0 : a.value ? 1 : -1,
        sorted: 0,
        allowMiddleState: true,
        hidable: true,
        hidden: false,
        size: 8,
      },
      ...columns.slice(2),
    ] as ITableColumn[];
  }, []);

  return (
    <div className={styles.wrapper}>
      <UserList
        key={+refetch}
        url={`${type}/bundle-participants/${spec}`}
        refactorUser={(user) =>
          refactorUser(locale, type, user, spec, handleBan)
        }
        initialColumns={team ? columns : initialColumns}
        noDefault
        empty={<>{locale.ui.table.emptyMessage}</>}
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

export default memo(ParticipantsListWithBan);
