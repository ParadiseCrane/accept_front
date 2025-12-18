"use client";
import { TogglerValue } from "@components/Dashboard/AIProbabilityList/AIProbabilityList";
import { DEFAULT_ON_PAGE } from "@constants/Defaults";
import { IAttemptDisplay } from "@custom-types/data/IAttempt";
import {
  AIGenSearch,
  AIGenUserTaskSearch,
  BaseSearch,
  UserTaskSearch,
} from "@custom-types/data/request";
import { ILocale } from "@custom-types/ui/ILocale";
import { ITableColumn } from "@custom-types/ui/ITable";
import { useLocale } from "@hooks/useLocale";
import { useRefetch } from "@hooks/useRefetch";
import { useUser } from "@hooks/useUser";
import { sendRequest } from "@requests/request";
import tableStyles from "@styles/ui/customTable.module.css";
import Table from "@ui/Table/Table";
import {
  errorNotification,
  newNotification,
} from "@utils/notificationFunctions";
import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface PagerResponse {
  data: IAttemptDisplay[];
  total: number;
}

interface TableData {
  data: any[];
  total: number;
}

const AIProbabilityList: FC<{
  url: string;
  activeTab: boolean;
  aiPercentage: string;
  classNames?: any;
  initialColumns: (_: ILocale, toggler: TogglerValue) => ITableColumn[];
  refactorAttempt: (_: IAttemptDisplay) => any;
  userSearch?: string[];
  taskSearch?: string[];
  noDefault?: boolean;
  empty?: ReactNode;
  defaultRowsOnPage?: number;
  shouldNotRefetch?: boolean;
  attemptQuery?: string;
  toggler: TogglerValue;
  setToggler: (value: TogglerValue) => void;
}> = ({
  url,
  activeTab,
  aiPercentage,
  classNames,
  initialColumns,
  refactorAttempt,
  userSearch,
  taskSearch,
  noDefault,
  empty,
  defaultRowsOnPage,
  shouldNotRefetch,
  toggler,
  setToggler,
}) => {
  const { locale } = useLocale();
  const { refreshAccess } = useUser();
  const defaultOnPage = useMemo(
    () => defaultRowsOnPage || DEFAULT_ON_PAGE,
    [defaultRowsOnPage]
  );

  const columns: ITableColumn[] = useMemo(() => {
    return initialColumns(locale, toggler);
  }, [locale, initialColumns, toggler]);

  const [loading, setLoading] = useState(true);
  const [needRefetch, setNeedRefetch] = useState(true);
  const [tableData, setTableData] = useState<TableData>({
    data: [],
    total: 0,
  });

  const [searchParams, setSearchParams] = useState<AIGenSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [{ field: "ai_generated", order: -1 }],
    search_params: {
      search: "",
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
    return sendRequest<AIGenUserTaskSearch, PagerResponse>(url, "POST", {
      ...searchParams,
      users: userSearch,
      tasks: taskSearch,
      ai_generated: aiPercentage,
    })
      .then((res) => {
        if (!res.error) {
          setTableData(processData(res.response));
        }
        setLoading(false);
      })
      .catch(onError);
  }, [
    onError,
    processData,
    searchParams,
    taskSearch,
    url,
    userSearch,
    aiPercentage,
  ]);

  const refetch = useCallback(() => {
    if (activeTab && !shouldNotRefetch && needRefetch) return fetch_data();
    return new Promise<void>(() => {});
  }, [activeTab, fetch_data, needRefetch, shouldNotRefetch]);

  const customSort = useCallback(
    (keyValue: string, order: -1 | 0 | 1) => {
      const key = keyValue as TogglerValue;
      if (order === 1 || order === -1) {
        setSearchParams((searchParamsValue: BaseSearch) => {
          const searchParams: BaseSearch = {
            ...searchParamsValue,
            sort_by: [{ field: key, order: order }],
          };
          setToggler(key);

          return { ...searchParams };
        });
      } else if (order === 0) {
        setSearchParams((searchParamsValue: BaseSearch) => {
          const searchParams: BaseSearch = {
            ...searchParamsValue,
            sort_by: [{ field: key, order: -1 }],
          };
          setToggler(key);

          return { ...searchParams };
        });
      }
    },
    [setSearchParams, setToggler]
  );

  useEffect(() => {
    fetch_data();
  }, [fetch_data]);

  useEffect(() => {
    if (activeTab && !shouldNotRefetch) {
      const intervalId = setInterval(() => {
        refetch();
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [activeTab, refetch, shouldNotRefetch]);

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
        customSort={customSort}
      />
    </div>
  );
};

export default memo(AIProbabilityList);
