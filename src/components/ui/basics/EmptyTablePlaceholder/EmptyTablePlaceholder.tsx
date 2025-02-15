import { DEFAULT_ON_PAGE } from '@constants/Defaults';
import { IRole } from '@custom-types/data/atomic';
import { IUser, IUserDisplay } from '@custom-types/data/IUser';
import { BaseSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import tableStyles from '@styles/ui/customTable.module.css';
import Table from '@ui/Table/Table';
import { customTableSort } from '@utils/customTableSort';
import Fuse from 'fuse.js';
import Link from 'next/link';
import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './style.module.css';
import { IUserDisplayItem } from '@ui/SimpleUserList/SimpleUserList';

const initialUsers: IUserDisplay[] = [
  {
    role: {
      spec: 12,
      name: 'role 1',
      accessLevel: 1,
    },
    login: '',
    shortName: 'shortname 1',
  },
  {
    role: {
      spec: 12,
      name: 'role 1',
      accessLevel: 1,
    },
    login: '',
    shortName: 'shortname 2',
  },
  {
    role: {
      spec: 12,
      name: 'role 1',
      accessLevel: 1,
    },
    login: '',
    shortName: 'shortname 3',
  },
  {
    role: {
      spec: 121,
      name: 'role 2',
      accessLevel: 2,
    },
    login: '',
    shortName: 'shortname 11',
  },
  {
    role: {
      spec: 121,
      name: 'role 2',
      accessLevel: 2,
    },
    login: '',
    shortName: 'shortname 21',
  },
  {
    role: {
      spec: 121,
      name: 'role 2',
      accessLevel: 2,
    },
    login: '',
    shortName: 'shortname 31',
  },
];

interface Item<T = any> {
  value: T;
  display: string | ReactNode;
}

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.ui.table.emptyTableTitle,
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
];

const refactorUser = (user: IUserDisplay): any => ({
  ...user,
  login: {
    value: user.login,
    display: <div className={tableStyles.titleWrapper}>{user.login}</div>,
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
        {user.role.name}
      </div>
    ),
  },
});

const EmptyTablePlaceholder: FC = () => {
  const { locale } = useLocale();
  const defaultOnPage = useMemo(() => DEFAULT_ON_PAGE, []);

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [initialColumns, locale]
  );

  const [users, setUsers] = useState<IUserDisplayItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newList: IUserDisplayItem[] = [];
    initialUsers.map((user) => newList.push(refactorUser(user)));
    setUsers(newList);
    setTotal(newList.length);
  }, []);

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: ['shortName.value', 'login.value'],
    },
  });

  return (
    <div className={styles.parent}>
      <div className={styles.blurWrapper}>
        {locale.ui.table.emptyTableMessage}
      </div>
      <div className={styles.tablePadding}>
        <Table
          columns={columns}
          rows={users}
          classNames={{
            wrapper: tableStyles.wrapper,
            table: tableStyles.table,
            author: tableStyles.author,
            grade: tableStyles.grade,
            verdict: tableStyles.verdict,
            headerCell: tableStyles.headerCell,
            cell: tableStyles.cell,
            even: tableStyles.even,
            odd: tableStyles.odd,
          }}
          noDefault={true}
          defaultOnPage={defaultOnPage}
          onPage={[5, defaultOnPage]}
          total={total}
          empty={<>{locale.ui.table.emptyMessage}</>}
          isEmpty={false}
          nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
          loading={false}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
        />
      </div>
    </div>
  );
};

export default memo(EmptyTablePlaceholder);
