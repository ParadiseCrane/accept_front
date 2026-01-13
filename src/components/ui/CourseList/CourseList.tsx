"use client";
import { DEFAULT_ON_PAGE } from "@constants/Defaults";
import { ICourseListItem } from "@custom-types/data/ICourse";
import { BaseSearch } from "@custom-types/data/request";
import { IAvailableLang, ILocale } from "@custom-types/ui/ILocale";
import { ITableColumn } from "@custom-types/ui/ITable";
import { useLocale } from "@hooks/useLocale";
import { useRequest } from "@hooks/useRequest";
import tableStyles from "@styles/ui/customTable.module.css";
import styles from "./courseList.module.css";
import Table from "@ui/Table/Table";
import { customTableSort } from "@utils/customTableSort";
import clsx from "clsx";
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

interface Item {
  value: any;
  display: string | ReactNode;
}

interface ICourseItem extends Omit<ICourseListItem, "title" | "readonly"> {
  title: Item;
  readonly: Item;
}

const refactorData = (
  course: ICourseListItem,
  lang: IAvailableLang,
): string => {
  const dayMonth = new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
  }).format(new Date(course.last_update));
  return `${dayMonth} ${new Date(course.last_update).getFullYear()}`;
};

const CourseList: FC<{
  url: string;
  classNames?: any;
  initialColumns: (_: ILocale) => ITableColumn[];
  refactorCourse: (_: ICourseListItem) => any;
  noDefault?: boolean;
  empty?: ReactNode;
  defaultRowsOnPage?: number;
}> = ({
  url,
  classNames,
  initialColumns,
  refactorCourse,
  noDefault,
  empty,
  defaultRowsOnPage,
}) => {
  const { locale, lang } = useLocale();

  const [total, setTotal] = useState(0);

  const defaultOnPage = useMemo(
    () => defaultRowsOnPage || DEFAULT_ON_PAGE,
    [defaultRowsOnPage],
  );

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale),
    [initialColumns, locale],
  );

  const [courses, setCourses] = useState<ICourseItem[]>([]);

  const processData = useCallback(
    (response: ICourseListItem[]): ICourseItem[] => {
      return response
        .map(
          (item) =>
            ({
              ...item,
              dateFormatted: refactorData(item, lang),
            }) as ICourseListItem,
        )
        .map((item) => refactorCourse(item));
    },
    [lang, refactorCourse],
  );

  const { data, loading } = useRequest<{}, ICourseListItem[], ICourseItem[]>(
    url,
    "GET",
    undefined,
    processData,
  );

  const [searchParams, setSearchParams] = useState<BaseSearch>({
    pager: {
      skip: 0,
      limit: defaultOnPage,
    },
    sort_by: [],
    search_params: {
      search: "",
      keys: ["name.value"],
    },
  });

  const applyFilters = useCallback(
    (data: ICourseItem[]) => {
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
        customTableSort(a, b, searchParams.sort_by, columns),
      );

      setTotal(sorted.length);

      const paged = sorted.slice(
        searchParams.pager.skip,
        searchParams.pager.limit > 0
          ? searchParams.pager.skip + searchParams.pager.limit
          : undefined,
      );
      setCourses(paged);
    },
    [columns, searchParams],
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
        rows={courses}
        classNames={{
          wrapper: clsx(tableStyles.wrapper, styles.wrapper),
          table: tableStyles.table,
          headerCell: styles.headerCell,
          cell: styles.cell,
          even: tableStyles.even,
          odd: tableStyles.odd,
        }}
        noDefault
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

export default memo(CourseList);
