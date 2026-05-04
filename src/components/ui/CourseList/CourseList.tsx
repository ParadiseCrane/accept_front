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
import Link from "next/link";
import { useViewportSize } from "@mantine/hooks";

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

const initialColumns = (locale: ILocale, width: number): ITableColumn[] => {
  if (width === 0) return [];

  return [
    {
      label: locale.course.list.lastChange,
      key: "lastChange",
      sortable: true,
      sortFunction: (a: any, b: any) =>
        a.lastChange.value > b.lastChange.value
          ? 1
          : a.lastChange.value == b.lastChange.value
            ? 0
            : -1,
      sorted: 0,
      allowMiddleState: true,
      hidable: true,
      hidden: width <= 480,
      size: 2,
    },
    {
      label: locale.course.list.name,
      key: "name",
      sortable: true,
      sortFunction: (a: any, b: any) =>
        a.name.value > b.name.value ? 1 : a.name.value == b.name.value ? 0 : -1,
      sorted: -1,
      allowMiddleState: true,
      hidable: false,
      hidden: false,
      size: 4,
    },
    {
      label: locale.course.list.author,
      key: "author",
      sortable: true,
      sortFunction: (a: any, b: any) =>
        a.author.value > b.author.value
          ? 1
          : a.author.value == b.author.value
            ? 0
            : -1,
      sorted: 0,
      allowMiddleState: true,
      hidable: false,
      hidden: false,
      size: 2,
    },
    {
      label: locale.course.list.numOfModules,
      key: "numOfModules",
      sortable: false,
      sortFunction: (a: any, b: any) =>
        a.numOfModules.value > b.numOfModules.value
          ? 1
          : a.numOfModules.value == b.numOfModules.value
            ? 0
            : -1,
      sorted: 0,
      allowMiddleState: true,
      hidable: false,
      hidden: width <= 480,
      size: 2,
    },
  ];
};

const refactorCourse = (course: ICourseListItem): any => ({
  lastChange: {
    value: course.last_update,
    display: (
      <div className={tableStyles.titleWrapper}>{course.dateFormatted}</div>
    ),
  },
  name: {
    value: course.title,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link
          className={tableStyles.title}
          href={`/course/${course.spec}`}
          prefetch={false}
        >
          {course.title}
        </Link>
      </div>
    ),
  },
  author: {
    value: course.author,
    display: <div className={tableStyles.titleWrapper}>{course.author}</div>,
  },
  numOfModules: {
    value: course.author,
    display: <div className={tableStyles.titleWrapper}>{course.amount}</div>,
  },
});

const CourseList: FC<{
  url: string;
}> = ({ url }) => {
  const { width } = useViewportSize();
  const { locale, lang } = useLocale();

  const [total, setTotal] = useState(0);

  const defaultOnPage = DEFAULT_ON_PAGE;

  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale, width),
    [locale, width],
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
    if (data && columns.length > 0) {
      applyFilters(data);
    }
  }, [applyFilters, data, columns]);

  if (width === 0 || columns.length === 0) return <></>;

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
        onPage={[10, 20]}
        total={total}
        empty={<>{locale.ui.table.emptyMessage}</>}
        isEmpty={data?.length == 0}
        nothingFound={<>{locale.ui.table.nothingFoundMessage}</>}
        loading={loading || columns.length === 0}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
};

export default memo(CourseList);
