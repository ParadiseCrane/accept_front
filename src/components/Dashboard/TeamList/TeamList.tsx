import { DEFAULT_ON_PAGE } from '@constants/Defaults';
import { ITeamDisplay, ITeamDisplayWithBanned } from '@custom-types/data/ITeam';
import { BaseSearch } from '@custom-types/data/request';
import { setter } from '@custom-types/ui/atomic';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
// import styles from './teamList.module.css'
import tableStyles from '@styles/ui/customTable.module.css';
import { Tip } from '@ui/basics';
import Table from '@ui/Table/Table';
import { customTableSort } from '@utils/customTableSort';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';

import BanButton from './BanButton/BanButton';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.team.list.name,
    key: 'name',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.name.value > b.name.value ? 1 : a.name.value == b.name.value ? 0 : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 5,
  },
  {
    label: locale.team.list.capitan,
    key: 'capitan',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.capitan.value.login > b.capitan.value.login
        ? 1
        : a.capitan.value.login == b.capitan.value.login
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
    label: locale.team.list.size,
    key: 'size',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.size > b.size ? 1 : a.size == b.size ? 0 : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 1,
  },
  {
    label: locale.team.list.banned,
    key: 'ban',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.ban.value > b.ban.value ? 1 : a.ban.value == b.ban.value ? 0 : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 2,
  },
];

const processData = (
  data: ITeamDisplayWithBanned[],
  spec: string,
  refetch: setter<boolean>
): any[] => {
  return data.map((team) => ({
    ...team,
    name: {
      value: team.name,
      display: (
        <Link className={tableStyles.title} href={`/team/${team.spec}`}>
          {team.name}
        </Link>
      ),
    },
    capitan: {
      value: team.capitan,
      display: (
        <Tip label={team.capitan.login}>
          <Link
            className={tableStyles.title}
            href={`/profile/${team.capitan.login}`}
          >
            {team.capitan.shortName}
          </Link>
        </Tip>
      ),
    },
    ban: {
      value: team.banned,
      display: (
        <BanButton team={team} spec={spec} onSuccess={() => refetch(false)} />
        // <>{team.banned ? 'Banned' : 'Not banned'}</>
      ),
    },
  }));
};

const TeamList: FC<{ spec: string }> = ({ spec }) => {
  const { locale } = useLocale();

  const [rows, setRows] = useState<ITeamDisplay[]>([]);

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: DEFAULT_ON_PAGE,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: ['name.value', 'capitan.value.login', 'capitan.value.shortName'],
    },
  });

  const columns = useMemo(() => initialColumns(locale), [locale]);
  const [refetchCounter, setRefetchCounter] = useState(0);
  const refetchKal = useCallback(() => setRefetchCounter((val) => val + 1), []);

  const { data, loading, refetch } = useRequest<{}, ITeamDisplayWithBanned[]>(
    `team/list/${spec}`,
    'GET',
    undefined,
    (data: ITeamDisplayWithBanned[]) => processData(data, spec, refetchKal)
  );

  useEffect(() => {
    if (refetchCounter != 0) refetch(false);
  }, [refetch, refetchCounter]);

  const applyFilters = useCallback(
    (data: ITeamDisplayWithBanned[]) => {
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

      const paged = sorted.slice(
        searchParams.pager.skip,
        searchParams.pager.limit > 0
          ? searchParams.pager.skip + searchParams.pager.limit
          : undefined
      );
      setRows(paged);
    },
    [columns, searchParams]
  );

  useEffect(() => {
    if (data) {
      applyFilters(data);
    }
  }, [applyFilters, data]);

  return (
    <div>
      <Table
        withSearch
        columns={columns}
        noDefault
        rows={rows}
        loading={loading}
        defaultOnPage={DEFAULT_ON_PAGE}
        onPage={[10, 20, 40]}
        total={data?.length || 0}
        empty={<>{locale.ui.table.emptyMessage}</>}
        isEmpty={data?.length == 0}
        nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
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
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
};

export default memo(TeamList);
