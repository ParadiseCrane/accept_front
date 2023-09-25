import Table from '@ui/Table/Table';
import { ITableColumn } from '@custom-types/ui/ITable';
import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import tableStyles from '@styles/ui/customTable.module.css';
import { useLocale } from '@hooks/useLocale';
import { BaseSearch } from '@custom-types/data/request';
import { useRequest } from '@hooks/useRequest';
import { ILocale } from '@custom-types/ui/ILocale';
import Fuse from 'fuse.js';
import { hasSubarray } from '@utils/hasSubarray';
import { customTableSort } from '@utils/customTableSort';
import {
  IParticipantListBundle,
  IUser,
} from '@custom-types/data/IUser';
import { IGroup } from '@custom-types/data/IGroup';
import { IRole } from '@custom-types/data/atomic';
import { capitalize } from '@utils/capitalize';
import { MultiSelect } from '@ui/basics';

interface Item<T = any> {
  value: T;
  display: string | ReactNode;
}

interface IUserDisplayList
  extends Omit<IUser, 'login' | 'shortName' | 'role'> {
  login: Item<string>;
  shortName: Item<string>;
  role: Item<IRole>;
  banned: Item<boolean>;
  banReason?: Item<string>;
}

const DEFAULT_ON_PAGE = 10;

const UsersList: FC<{
  url: string;
  classNames?: any;
  initialColumns: (_: ILocale) => ITableColumn[];
  refactorUser: (_: any) => IUserDisplayList;
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

  const [groups, setGroups] = useState<IGroup[]>([]);
  const [currentGroups, setCurrentGroups] = useState<string[]>([]);

  const [roles, setRoles] = useState<IRole[]>([]);
  const [currentRoles, setCurrentRoles] = useState<string[]>([]);

  const [users, setUsers] = useState<IUserDisplayList[]>([]);
  const [total, setTotal] = useState(0);

  const processData = useCallback(
    (
      response: IParticipantListBundle
    ): {
      users: IUserDisplayList[];
      groups: IGroup[];
      roles: IRole[];
    } => ({
      users: response.users.map((user) => refactorUser(user)),
      groups: response.groups,
      roles: response.roles,
    }),
    [refactorUser]
  );

  const { data, loading } = useRequest<
    {},
    IParticipantListBundle,
    {
      users: IUserDisplayList[];
      groups: IGroup[];
      roles: IRole[];
    }
  >(url, 'GET', undefined, processData);

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: ['login.value', 'shortName.value', 'name'],
    },
  });

  const searchGroups = useMemo(
    () =>
      groups.map((group) => ({
        label: group.name,
        value: group.spec,
      })),
    [groups]
  );
  const searchRoles = useMemo(
    () =>
      roles.map((role) => ({
        label: capitalize(role.name),
        value: role.spec.toString(),
      })),
    [roles]
  );

  const applyFilters = useCallback(
    (data: IUserDisplayList[]) => {
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

      const grouped =
        currentGroups.length > 0
          ? searched.filter((user) =>
              hasSubarray(
                user.groups.map((group: IGroup) => group.spec),
                currentGroups
              )
            )
          : searched;

      const withRole =
        currentRoles.length > 0
          ? grouped.filter((user) =>
              currentRoles.includes(user.role.value.spec.toString())
            )
          : grouped;

      const sorted = withRole.sort((a, b) =>
        customTableSort(a, b, searchParams.sort_by, columns)
      );

      setTotal(sorted.length);

      const paged = sorted.slice(
        searchParams.pager.skip,
        searchParams.pager.limit > 0
          ? searchParams.pager.skip + searchParams.pager.limit
          : undefined
      );
      setUsers(paged);
    },
    [columns, currentGroups, currentRoles, searchParams, setTotal]
  );

  useEffect(() => {
    if (data) {
      applyFilters(data.users);
      setGroups(data.groups);
      setRoles(data.roles);
    }
  }, [data, applyFilters]);

  const resetPage = useCallback(() => {
    setSearchParams((searchParams: BaseSearch) => ({
      ...searchParams,
      pager: {
        ...searchParams.pager,
        skip: 0,
      },
    }));
  }, []);

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
        isEmpty={data?.users.length == 0}
        nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
        defaultOnPage={defaultOnPage}
        onPage={[5, defaultOnPage]}
        total={total}
        loading={loading}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        withSearch
        additionalSearch={
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 'var(--spacer-l)',
              width: '100%',
            }}
          >
            <MultiSelect
              searchable
              data={searchGroups}
              onChange={(value) => {
                resetPage();
                setCurrentGroups(value);
              }}
              placeholder={locale.placeholders.selectGroups}
            />
            <MultiSelect
              searchable
              data={searchRoles}
              onChange={(value) => {
                resetPage();
                setCurrentRoles(value);
              }}
              placeholder={locale.placeholders.selectRoles}
            />
          </div>
        }
      />
    </div>
  );
};

export default memo(UsersList);
