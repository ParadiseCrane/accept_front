import { DEFAULT_ON_PAGE } from '@constants/Defaults';
import { IGradeChange } from '@custom-types/data/IStudent';
import { BaseSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import tableStyles from '@styles/ui/customTable.module.css';
import Table from '@ui/Table/Table';
import { customTableSort } from '@utils/customTableSort';
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

const ChangeGradeList: FC<{
  data: IGradeChange[];
  initialColumns: (_: ILocale) => ITableColumn[];
  classNames?: any;
  empty?: ReactNode;
  noDefault?: boolean;
  defaultRowsOnPage?: number;
}> = ({
  data,
  initialColumns,
  classNames,

  noDefault,
  empty,
  defaultRowsOnPage,
}) => {
  const { locale } = useLocale();

  const [users, setUsers] = useState<IGradeChange[]>(data);

  const [total, setTotal] = useState(0);

  const defaultOnPage = useMemo(
    () => defaultRowsOnPage || DEFAULT_ON_PAGE,
    [defaultRowsOnPage]
  );

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [locale, initialColumns]
  );

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: ['login'],
    },
  });

  const applyFilters = useCallback(
    (data: IGradeChange[]) => {
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

      const paged = sorted.slice(
        searchParams.pager.skip,
        searchParams.pager.limit > 0
          ? searchParams.pager.skip + searchParams.pager.limit
          : undefined
      );
      setUsers(paged);
    },
    [columns, searchParams]
  );

  useEffect(() => {
    applyFilters(data);
  }, [applyFilters, data]);

  return (
    <div>
      <Table
        columns={columns}
        rows={users}
        total={total}
        loading={false}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        noDefault={noDefault}
        empty={empty || <>{locale.ui.table.emptyMessage}</>}
        isEmpty={data?.length == 0}
        nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
        withSearch
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
        defaultOnPage={defaultOnPage}
        onPage={[defaultOnPage, 30]}
      />
    </div>
  );
};

export default memo(ChangeGradeList);
