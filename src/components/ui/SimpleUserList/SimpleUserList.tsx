import { DEFAULT_ON_PAGE } from '@constants/Defaults';
import { IRole } from '@custom-types/data/atomic';
import { IGroup } from '@custom-types/data/IGroup';
import {
  IParticipantListBundle,
  IUser,
  IUserDisplay,
} from '@custom-types/data/IUser';
import { BaseSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import tableStyles from '@styles/ui/customTable.module.css';
import { MultiSelect } from '@ui/basics';
import Table from '@ui/Table/Table';
import { capitalize } from '@utils/capitalize';
import { customTableSort } from '@utils/customTableSort';
import { hasSubarray } from '@utils/hasSubarray';
import Fuse from 'fuse.js';
import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const initialUserList: IUserDisplay[] = [
  {
    role: {
      spec: 12,
      name: 'role 1',
      accessLevel: 1,
    },
    login: 'login 1',
    shortName: 'shortname 1',
  },
  {
    role: {
      spec: 12,
      name: 'role 1',
      accessLevel: 1,
    },
    login: 'login 2',
    shortName: 'shortname 2',
  },
  {
    role: {
      spec: 12,
      name: 'role 1',
      accessLevel: 1,
    },
    login: 'login 3',
    shortName: 'shortname 3',
  },
  {
    role: {
      spec: 121,
      name: 'role 2',
      accessLevel: 2,
    },
    login: 'login 11',
    shortName: 'shortname 11',
  },
  {
    role: {
      spec: 121,
      name: 'role 2',
      accessLevel: 2,
    },
    login: 'login 21',
    shortName: 'shortname 21',
  },
  {
    role: {
      spec: 121,
      name: 'role 2',
      accessLevel: 2,
    },
    login: 'login 31',
    shortName: 'shortname 31',
  },
];

interface Item<T = any> {
  value: T;
  display: string | ReactNode;
}

interface IUserDisplayItem extends Omit<IUser, 'login' | 'shortName' | 'role'> {
  login: Item<string>;
  shortName: Item<string>;
  role: Item<IRole>;
}

const SimpleUserList: FC<{
  url: string;
  classNames?: any;
  initialColumns: (_: ILocale) => ITableColumn[];
  refactorUser: (_: any) => IUserDisplayItem;
  noDefault?: boolean;
  empty?: ReactNode;
  defaultRowsOnPage?: number;
}> = ({
  url,
  classNames,
  initialColumns,
  refactorUser,
  noDefault,
  empty,
  defaultRowsOnPage,
}) => {
  const { locale } = useLocale();
  const defaultOnPage = useMemo(
    () => defaultRowsOnPage || DEFAULT_ON_PAGE,
    [defaultRowsOnPage]
  );

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [initialColumns, locale]
  );

  const [users, setUsers] = useState<IUserDisplayItem[]>([]);
  const [total, setTotal] = useState(0);

  const processData = useCallback(
    (response: IUserDisplay[]) => response.map((user) => refactorUser(user)),
    [refactorUser]
  );

  const initialData: IUserDisplay[] = initialUserList;
  const data: IUserDisplayItem[] = [];
  initialData.map((user) => {
    data.push(refactorUser(user));
  });
  data.map((user) => refactorUser(user));
  const loading = false;

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: ['name.value'],
    },
  });

  const applyFilters = useCallback(
    (data: IUserDisplayItem[]) => {
      var list = [...data];
      const fuse = new Fuse(list, {
        keys: searchParams.search_params.keys,
        findAllMatches: true,
      });

      const searched =
        searchParams.search_params.search == ''
          ? list
          : fuse
              .search(searchParams.search_params.search)
              .map((result) => result.item);

      const sorted = searched.sort((a, b) =>
        customTableSort(a, b, searchParams.sort_by, columns)
      );

      setTotal(sorted.length);

      const users = sorted.slice(
        searchParams.pager.skip,
        searchParams.pager.limit > 0
          ? searchParams.pager.skip + searchParams.pager.limit
          : undefined
      );
      setUsers(users);
    },
    [columns, searchParams]
  );

  useEffect(() => {
    if (data) {
      applyFilters(data);
    }
  }, [applyFilters]);

  return (
    <div>
      <Table
        columns={columns}
        rows={users}
        classNames={
          classNames
            ? classNames
            : {
                wrapper: tableStyles.wrapper,
                table: tableStyles.table,
                author: tableStyles.author,
                grade: tableStyles.grade,
                verdict: tableStyles.verdict,
                headerCell: tableStyles.headerCell,
                cell: tableStyles.cell,
                even: tableStyles.even,
                odd: tableStyles.odd,
              }
        }
        noDefault={noDefault}
        empty={empty || <>{locale.ui.table.emptyMessage}</>}
        isEmpty={data?.length == 0}
        nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
        defaultOnPage={defaultOnPage}
        onPage={[5, defaultOnPage]}
        total={total}
        loading={loading}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        withSearch
      />
    </div>
  );
};

export default memo(SimpleUserList);
