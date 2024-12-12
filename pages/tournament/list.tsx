import Table from '@ui/Table/Table';
import { ITableColumn } from '@custom-types/ui/ITable';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import tableStyles from '@styles/ui/customTable.module.css';
import { useLocale } from '@hooks/useLocale';
import {
  ITournamentDisplay,
  ITournamentListBundle,
} from '@custom-types/data/ITournament';
import { Clock, Confetti, Plus, Run } from 'tabler-icons-react';
import { ITag } from '@custom-types/data/ITag';
import SingularSticky from '@ui/Sticky/SingularSticky';
import { BaseSearch } from '@custom-types/data/request';
import { useRequest } from '@hooks/useRequest';
import { ILocale } from '@custom-types/ui/ILocale';
import Fuse from 'fuse.js';
import { hasSubarray } from '@utils/hasSubarray';
import { MultiSelect } from '@ui/basics';
import { customTableSort } from '@utils/customTableSort';
import Title from '@ui/Title/Title';
import { getLocalDate } from '@utils/datetime';
import { Tip } from '@ui/basics';
import { useUser } from '@hooks/useUser';
import Link from 'next/link';
import { mapTournamentStatus } from '@utils/mapStatus';

interface Item {
  value: any;
  display: string | ReactNode;
}

interface ITournamentDisplayList
  extends Omit<
    ITournamentDisplay,
    'title' | 'author' | 'start' | 'end' | 'status'
  > {
  title: Item;
  author: Item;
  start: Item;
  end: Item;
  status: Item;
}

const sortByStartEnd = ({
  a,
  b,
  startEnd,
}: {
  a: any;
  b: any;
  startEnd: 'start' | 'end';
}) => {
  if (a.status.value == 0 && b.status.value == 0) {
    if (startEnd == 'start') {
      return 0;
    } else {
      return a.end.value > b.end.value
        ? 1
        : a.end.value == b.end.value
        ? 0
        : -1;
    }
  } else if (a.status.value == 1 && b.status.value == 1) {
    if (startEnd == 'start') {
      return a.start.value > b.start.value
        ? 1
        : a.start.value == b.start.value
        ? 0
        : -1;
    } else {
      return 0;
    }
  } else if (a.status.value == 2 && b.status.value == 2) {
    if (startEnd == 'start') {
      return 0;
    } else {
      return a.end.value < b.end.value
        ? 1
        : a.end.value == b.end.value
        ? 0
        : -1;
    }
  } else {
    return 0;
  }
};

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: '',
    key: 'status',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.status.value > b.status.value
        ? 1
        : a.status.value == b.status.value
        ? 0
        : -1;
    },
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
  {
    label: locale.tournament.list.title,
    key: 'title',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.title.value > b.title.value
        ? 1
        : a.title.value == b.title.value
        ? 0
        : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 6,
  },
  {
    label: locale.tournament.list.author,
    key: 'author',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.author > b.author ? 1 : a.author == b.author ? 0 : -1;
    },
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 2,
  },
  {
    label: locale.tournament.list.start,
    key: 'start',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.start.value > b.start.value
        ? 1
        : a.start.value == b.start.value
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
    label: locale.tournament.list.end,
    key: 'end',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.end.value > b.end.value
        ? 1
        : a.end.value == b.end.value
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
    label: locale.tournament.list.maxTeamSize,
    key: 'maxTeamSize',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.maxTeamSize > b.maxTeamSize
        ? 1
        : a.maxTeamSize == b.maxTeamSize
        ? 0
        : -1;
    },
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 3,
  },
];

const getTournamentIcon = (
  tournament: ITournamentDisplay,
  locale: ILocale
): ReactNode => {
  switch (tournament.status.spec) {
    case 0:
      return (
        <Tip position="bottom" label={locale.tip.status.pending}>
          <Clock color="orange" />
        </Tip>
      );
    case 1:
      return (
        <Tip position="bottom" label={locale.tip.status.running}>
          <Run color="var(--positive)" />
        </Tip>
      );
    case 2:
      return (
        <Tip position="bottom" label={locale.tip.status.finished}>
          <Confetti color="black" />
        </Tip>
      );
    default:
      return <></>;
  }
};

const processData = (
  data: ITournamentListBundle,
  locale: ILocale
): {
  tournaments: ITournamentDisplayList[];
  tags: ITag[];
} => {
  const tournamentsData = data.tournaments.map(
    (tournament: ITournamentDisplay): any => ({
      ...tournament,
      status: {
        // value: tournament.status.spec,
        value: mapTournamentStatus(tournament.status.spec),
        display: <>{getTournamentIcon(tournament, locale)}</>,
      },
      start: {
        value: tournament.start,
        display: <div>{getLocalDate(tournament.start)}</div>,
      },
      end: {
        value: tournament.end,
        display: <div>{getLocalDate(tournament.end)}</div>,
      },
      title: {
        value: tournament.title,
        display: (
          <div className={tableStyles.titleWrapper}>
            <Link
              className={tableStyles.title}
              href={`/tournament/${tournament.spec}`}
            >
              {tournament.title}
            </Link>
            {tournament.tags.length > 0 && (
              <span className={tableStyles.tags}>
                {tournament.tags.map((tag, idx) => (
                  <div className={tableStyles.tag} key={idx}>
                    {tag.title +
                      (idx == tournament.tags.length - 1 ? '' : ', ')}
                  </div>
                ))}
              </span>
            )}
          </div>
        ),
      },
    })
  );
  const running = tournamentsData
    .filter((element) => element.status.value === 0)
    .sort((a, b) => sortByStartEnd({ a: a, b: b, startEnd: 'end' }));
  const pending = tournamentsData
    .filter((element) => element.status.value === 1)
    .sort((a, b) => sortByStartEnd({ a: a, b: b, startEnd: 'start' }));
  const finished = tournamentsData
    .filter((element) => element.status.value === 2)
    .sort((a, b) => sortByStartEnd({ a: a, b: b, startEnd: 'end' }));
  const tournaments = [...running, ...pending, ...finished];
  const tags = data.tags;
  return { tournaments, tags };
};

const defaultOnPage = 10;

function TournamentList() {
  const { locale } = useLocale();
  const { isTeacher } = useUser();

  const [list, setList] = useState<ITournamentDisplayList[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    // sort_by: [{ field: 'status', order: 1 }],
    sort_by: [],
    search_params: {
      search: '',
      keys: ['title.value', 'author.value'],
    },
  });

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [locale]
  );

  const searchTags = useMemo(
    () =>
      tags.map((tag) => ({
        label: tag.title,
        value: tag.spec,
      })),
    [tags]
  );

  const { data, loading } = useRequest<
    {},
    ITournamentListBundle,
    {
      tournaments: ITournamentDisplayList[];
      tags: ITag[];
    }
  >(
    'tournament/list',
    'GET',
    undefined,
    (() => {
      return (data: ITournamentListBundle) => processData(data, locale);
    })()
  );

  const applyFilters = useCallback(
    (data: ITournamentDisplayList[]) => {
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

      const tagged =
        currentTags.length > 0
          ? searched.filter((task) =>
              hasSubarray(
                task.tags.map((tag: ITag) => tag.spec),
                currentTags
              )
            )
          : searched;

      const sorted = tagged.sort((a, b) =>
        customTableSort(a, b, searchParams.sort_by, columns)
      );

      setTotal(sorted.length);

      const paged = sorted.slice(
        searchParams.pager.skip,
        searchParams.pager.limit > 0
          ? searchParams.pager.skip + searchParams.pager.limit
          : undefined
      );
      setList(paged);
    },
    [columns, currentTags, searchParams]
  );

  useEffect(() => {
    if (data) {
      applyFilters(data.tournaments);
      setTags(data.tags);
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
      <Title title={locale.titles.tournament.list} />
      <Table
        columns={columns}
        rows={list}
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
        defaultOnPage={10}
        onPage={[5, 10]}
        total={total}
        empty={<>{locale.ui.table.emptyMessage}</>}
        isEmpty={data?.tournaments.length == 0}
        nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
        loading={loading}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        withSearch
        additionalSearch={
          <div style={{ maxWidth: '300px' }}>
            <MultiSelect
              searchable
              data={searchTags}
              onChange={(value) => {
                resetPage();
                setCurrentTags(value);
              }}
              placeholder={locale.placeholders.selectTags}
            />
          </div>
        }
      />
      \
      {isTeacher && (
        <SingularSticky
          href={`/tournament/add`}
          icon={<Plus height={25} width={25} />}
          description={locale.tip.sticky.tournament.add}
        />
      )}
    </div>
  );
}

TournamentList.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default TournamentList;
