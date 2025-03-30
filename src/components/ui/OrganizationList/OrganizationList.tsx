import { DEFAULT_ON_PAGE } from '@constants/Defaults';
import { IGroupDisplay } from '@custom-types/data/IGroup';
import {
  IOrganization,
  IOrganizationList,
} from '@custom-types/data/IOrganization';
import { BaseSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
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

const OrganizationList: FC<{
  url: string;
  classNames?: any;
  initialColumns: (_: ILocale) => ITableColumn[];
  refactorOrganization: (_: IOrganization) => any;
  noDefault?: boolean;
  empty?: ReactNode;
  defaultRowsOnPage?: number;
}> = ({
  url,
  classNames,
  initialColumns,
  refactorOrganization,
  noDefault,
  empty,
  defaultRowsOnPage,
}) => {
  const { locale } = useLocale();

  const [total, setTotal] = useState(0);

  const defaultOnPage = useMemo(
    () => defaultRowsOnPage || DEFAULT_ON_PAGE,
    [defaultRowsOnPage]
  );

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [initialColumns, locale]
  );

  const [organizations, setOrganizations] = useState<IOrganizationList[]>([]);

  const processData = useCallback(
    (response: IOrganization[]): IOrganizationList[] =>
      response.map((item) => refactorOrganization(item)),
    [refactorOrganization]
  );

  const { data, loading } = useRequest<
    {},
    IOrganization[],
    IOrganizationList[]
  >(url, 'GET', undefined, processData);

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [],
    search_params: {
      search: '',
      keys: ['spec.value'],
    },
  });

  const applyFilters = useCallback(
    (data: IOrganizationList[]) => {
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
      setOrganizations(paged);
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
        rows={organizations}
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
        defaultOnPage={defaultOnPage}
        onPage={[5, defaultOnPage]}
        total={total}
        empty={empty || <>{locale.ui.table.emptyMessage}</>}
        isEmpty={data?.length == 0}
        nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
        loading={loading}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
};

export default memo(OrganizationList);
