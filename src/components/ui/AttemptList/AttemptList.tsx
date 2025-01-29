import { DEFAULT_ON_PAGE } from '@constants/Defaults';
import { IAttemptDisplay } from '@custom-types/data/IAttempt';
import { BaseSearch, UserTaskSearch } from '@custom-types/data/request';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { useLocale } from '@hooks/useLocale';
import { useRefetch } from '@hooks/useRefetch';
import { useUser } from '@hooks/useUser';
import { sendRequest } from '@requests/request';
import tableStyles from '@styles/ui/customTable.module.css';
import Table from '@ui/Table/Table';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface PagerResponse {
  data: IAttemptDisplay[];
  total: number;
}

interface TableData {
  data: any[];
  total: number;
}

const AttemptList: FC<{
  url: string;
  activeTab: boolean;
  classNames?: any;
  initialColumns: (_: ILocale) => ITableColumn[];
  refactorAttempt: (_: IAttemptDisplay) => any;
  userSearch?: string[];
  taskSearch?: string[];
  toDate?: Date;
  noDefault?: boolean;
  empty?: ReactNode;
  defaultRowsOnPage?: number;
  shouldNotRefetch?: boolean;
  attemptQuery?: string;
}> = ({
  url,
  activeTab,
  classNames,
  initialColumns,
  refactorAttempt,
  userSearch,
  taskSearch,
  toDate,
  noDefault,
  empty,
  defaultRowsOnPage,
  shouldNotRefetch,
}) => {
  const { locale } = useLocale();
  const { refreshAccess } = useUser();
  const defaultOnPage = useMemo(
    () => defaultRowsOnPage || DEFAULT_ON_PAGE,
    [defaultRowsOnPage]
  );

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [locale, initialColumns]
  );

  const [loading, setLoading] = useState(true);
  const [needRefetch, setNeedRefetch] = useState(true);
  const [tableData, setTableData] = useState<TableData>({
    data: [],
    total: 0,
  });

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [{ field: 'date', order: -1 }],
    search_params: {
      search: '',
      keys: [],
    },
  });

  const processData = useCallback(
    (response: PagerResponse): TableData => ({
      data: response.data.map((item) => refactorAttempt(item)),
      total: response.total,
    }),
    [refactorAttempt]
  );

  const onError = useCallback(
    (_: any) => {
      if (refreshAccess() == 2) {
        setTableData({ data: [], total: 0 });
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.errors.unauthorized,
          autoClose: 10000,
        });
        setNeedRefetch(false);
      } else {
        setNeedRefetch(true);
      }
      setLoading(false);
    },
    [locale.notify.errors.unauthorized, refreshAccess]
  );
  const fetch_data = useCallback(() => {
    return sendRequest<UserTaskSearch, PagerResponse>(url, 'POST', {
      ...searchParams,
      toDate,
      users: userSearch,
      tasks: taskSearch,
    })
      .then((res) => {
        if (!res.error) {
          setTableData(processData(res.response));
        }
        setLoading(false);
      })
      .catch(onError);
  }, [onError, processData, searchParams, taskSearch, toDate, url, userSearch]);

  const refetch = useCallback(() => {
    if (activeTab && !shouldNotRefetch && needRefetch) return fetch_data();
    return new Promise<void>((res) => {
      res();
    });
  }, [activeTab, fetch_data, needRefetch, shouldNotRefetch]);

  useEffect(() => {
    fetch_data();
  }, [fetch_data]);

  return (
    <div>
      <Table
        columns={columns}
        rows={tableData.data}
        total={tableData.total}
        loading={loading}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
        noDefault={noDefault}
        empty={empty}
        isEmpty={tableData.total == 0}
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
        onPage={[5, defaultOnPage]}
      />
    </div>
  );
};

export default memo(AttemptList);
