import {
  IAssignmentSchemaDisplay,
  IAssignmentSchemaListBundle,
} from '@custom-types/data/IAssignmentSchema';
import { ITag } from '@custom-types/data/ITag';
import { BaseSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { DefaultLayout } from '@layouts/DefaultLayout';
import tableStyles from '@styles/ui/customTable.module.css';
import { MultiSelect } from '@ui/basics';
import SingularSticky from '@ui/Sticky/SingularSticky';
import Table from '@ui/Table/Table';
import Title from '@ui/Title/Title';
import { customTableSort } from '@utils/customTableSort';
import { hasSubarray } from '@utils/hasSubarray';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'tabler-icons-react';

interface Item {
  value: any;
  display: string | ReactNode;
}

interface IAssignmentSchemaDisplayList
  extends Omit<IAssignmentSchemaDisplay, 'title' | 'author' | 'taskNumber'> {
  title: Item;
  author: Item;
  taskNumber: Item;
}

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.assignmentSchema.list.title,
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
    size: 8,
  },
  {
    label: locale.assignmentSchema.list.author,
    key: 'author',
    sortable: true,
    sortFunction: (a: any, b: any) => {
      return a.author.value > b.author.value
        ? 1
        : a.author.value == b.author.value
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
    label: locale.assignmentSchema.list.taskNumber,
    key: 'taskNumber',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.taskNumber.value > b.taskNumber.value
        ? 1
        : a.taskNumber.value == b.taskNumber.value
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 2,
  },
];

const processData = (
  data: IAssignmentSchemaListBundle
): {
  assignment_schemas: IAssignmentSchemaDisplayList[];
  tags: ITag[];
} => {
  const assignment_schemas = data.assignment_schemas.map(
    (assignment_schema: IAssignmentSchemaDisplay): any => ({
      ...assignment_schema,
      author: {
        value: assignment_schema.author,
        display: assignment_schema.author,
      },
      title: {
        value: assignment_schema.title,
        display: (
          <div className={tableStyles.titleWrapper}>
            <Link
              className={tableStyles.title}
              href={`/assignment_schema/${assignment_schema.spec}`}
            >
              {assignment_schema.title}
            </Link>
            {assignment_schema.tags.length > 0 && (
              <span className={tableStyles.tags}>
                {assignment_schema.tags.map((tag, idx) => (
                  <div className={tableStyles.tag} key={idx}>
                    {tag.title +
                      (idx == assignment_schema.tags.length - 1 ? '' : ', ')}
                  </div>
                ))}
              </span>
            )}
          </div>
        ),
      },
      taskNumber: {
        value: assignment_schema.taskNumber,
        display: assignment_schema.taskNumber,
      },
    })
  );
  const tags = data.tags;
  return { assignment_schemas, tags };
};

const defaultOnPage = 10;

function AssignmentList() {
  const { locale } = useLocale();

  const [list, setList] = useState<IAssignmentSchemaDisplayList[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
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
    IAssignmentSchemaListBundle,
    {
      assignment_schemas: IAssignmentSchemaDisplayList[];
      tags: ITag[];
    }
  >('assignment_schema/list', 'GET', undefined, processData);

  const applyFilters = useCallback(
    (data: IAssignmentSchemaDisplayList[]) => {
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
      applyFilters(data.assignment_schemas);
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
      <Title title={locale.titles.assignment_schema.list} />
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
        isEmpty={data?.assignment_schemas.length == 0}
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
      <SingularSticky
        href={`/assignment_schema/add`}
        icon={<Plus height={25} width={25} />}
        description={locale.tip.sticky.assignmentSchema.add}
      />
    </div>
  );
}

AssignmentList.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default AssignmentList;
