"use client";
import { AddModeratorModal } from "@components/Dashboard/Moderators/AddModeratorModal/AddModeratorModal";
import { DEFAULT_ON_PAGE } from "@constants/Defaults";
import { IModeratorGroupPair } from "@custom-types/data/ICourse";
import { IGroup } from "@custom-types/data/IGroup";
import { IUserBaseInfo } from "@custom-types/data/IUser";
import { BaseSearch } from "@custom-types/data/request";
import { ILocale } from "@custom-types/ui/ILocale";
import { ITableColumn } from "@custom-types/ui/ITable";
import { useLocale } from "@hooks/useLocale";
import { sendRequest } from "@requests/request";
import tableStyles from "@styles/ui/customTable.module.css";
import Table from "@ui/Table/Table";
import { customTableSort } from "@utils/customTableSort";
import Fuse from "fuse.js";
import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface Item<T = any> {
  value: T;
  display: string | ReactNode;
}

export interface ICourseModeratorGroupItem
  extends Omit<IModeratorGroupPair, "moderator" | "group"> {
  moderator: Item<IUserBaseInfo>;
  group: Item<IGroup>;
}

const GroupModeratorList: FC<{
  url: string;
  isAuthor: boolean;
  classNames?: any;
  initialColumns: (_: ILocale) => ITableColumn[];
  refactorPair: ({
    pair,
    fetchData,
  }: {
    pair: IModeratorGroupPair;
    fetchData: () => Promise<void>;
  }) => ICourseModeratorGroupItem;
  noDefault?: boolean;
  empty?: ReactNode;
  defaultRowsOnPage?: number;
}> = ({
  url,
  isAuthor,
  classNames,
  initialColumns,
  refactorPair,
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

  const [pairs, setPairs] = useState<ICourseModeratorGroupItem[]>([]);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<ICourseModeratorGroupItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await sendRequest<{}, IModeratorGroupPair[]>(
      url,
      "GET",
      undefined
    );
    if (!response.error) {
      const pairList = response.response;
      const pairItemList: ICourseModeratorGroupItem[] = pairList.map(
        (pair: IModeratorGroupPair) => refactorPair({ pair, fetchData })
      );
      setData(pairItemList);
    }
    setLoading(false);
  }, [url, refactorPair]);

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [],
    search_params: {
      search: "",
      keys: ["group.value", "moderator.value"],
    },
  });

  const applyFilters = useCallback(
    (data: ICourseModeratorGroupItem[]) => {
      var list = [...data];
      const fuse = new Fuse(list, {
        keys: searchParams.search_params.keys,
        findAllMatches: true,
      });

      const searched =
        searchParams.search_params.search == ""
          ? list
          : fuse
              .search(searchParams.search_params.search)
              .map((result) => result.item);

      const sorted = searched.sort((a, b) =>
        customTableSort(a, b, searchParams.sort_by, columns)
      );

      setTotal(sorted.length);

      const pairs = sorted.slice(
        searchParams.pager.skip,
        searchParams.pager.limit > 0
          ? searchParams.pager.skip + searchParams.pager.limit
          : undefined
      );
      setPairs(pairs);
    },
    [columns, searchParams]
  );

  useEffect(() => {
    if (data) {
      applyFilters(data);
    }
  }, [applyFilters, data]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Table
        withSearch
        columns={columns}
        rows={pairs}
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
        additionalSearch={
          isAuthor && <AddModeratorModal refetchData={fetchData} />
        }
        emptyTableComponent={
          isAuthor && (
            <>
              {locale.ui.table.emptyTableMessage}
              <AddModeratorModal refetchData={fetchData} />
            </>
          )
        }
      />
    </div>
  );
};

export default memo(GroupModeratorList);
