"use client";
import { IAttemptDisplay } from "@custom-types/data/IAttempt";
import { ITaskBaseInfo } from "@custom-types/data/ITask";
import { ILocale } from "@custom-types/ui/ILocale";
import { ITableColumn } from "@custom-types/ui/ITable";
import { useLocale } from "@hooks/useLocale";
import tableStyles from "@styles/ui/customTable.module.css";
import AttemptList from "@ui/AttemptList/AttemptList";
import { TaskSelect } from "@ui/selectors";
import VerdictWrapper from "@ui/VerdictWrapper/VerdictWrapper";
import { getLocalDate } from "@utils/datetime";
import Link from "next/link";
import { FC, memo, useMemo, useState } from "react";

import styles from "./attemptListProfile.module.css";
import { useViewportSize } from "@mantine/hooks";
import clsx from "clsx";
import { useTanstackRequest } from "@hooks/useTanstackRequest";
const refactorAttempt = (attempt: IAttemptDisplay): any => ({
  ...attempt,
  result: {
    display: (
      <VerdictWrapper
        status={attempt.status}
        verdict={attempt.verdict?.verdict}
        test={attempt.verdict?.test}
      />
    ),
    value:
      attempt.status.spec == 2
        ? attempt.verdict?.verdict.spec
        : attempt.status.spec == 3
          ? attempt.status.spec - 20
          : attempt.status.spec - 10,
  },
  date: {
    display: (
      <Link
        className={tableStyles.link}
        href={`/attempt/${attempt.spec}`}
        prefetch={false}
      >
        {getLocalDate(attempt.date)}
      </Link>
    ),
    value: new Date(attempt.date).getTime(),
  },
  language: {
    display: <>{attempt.language.name}</>,
    value: attempt.language,
  },
  task: {
    display: (
      <Link
        href={`/task/${attempt.task.spec}`}
        className={styles.taskLink}
        prefetch={false}
      >
        {attempt.task.title}
      </Link>
    ),
    value: attempt.task,
  },
});

const initialColumns = (locale: ILocale, width: number): ITableColumn[] => {
  if (width === 0) return [];

  return [
    {
      label: locale.attempt.date,
      key: "date",
      sortable: true,
      sortFunction: (a: any, b: any) =>
        a.date.value > b.date.value ? -1 : a.date.value == b.date.value ? 0 : 1,
      sorted: -1,
      allowMiddleState: false,
      hidable: false,
      hidden: false,
      size: 2,
    },
    {
      label: locale.attempt.task,
      key: "task",
      sortable: false,
      sortFunction: (_: any, __: any) => 0,
      sorted: 0,
      allowMiddleState: false,
      hidable: false,
      hidden: false,
      size: 5,
    },
    {
      label: locale.attempt.language,
      key: "language",
      sortable: false,
      sortFunction: (_: any, __: any) => 0,
      sorted: 0,
      allowMiddleState: true,
      hidable: true,
      hidden: width <= 425,
      size: 2,
    },
    {
      label: locale.attempt.result,
      key: "result",
      sortable: false,
      sortFunction: (_: any, __: any) => 0,
      sorted: 0,
      allowMiddleState: true,
      hidable: false,
      hidden: false,
      size: 2,
    },
  ];
};

const AttemptListProfile: FC<{}> = () => {
  const { locale } = useLocale();
  const { width } = useViewportSize();
  const [taskSearch, setTaskSearch] = useState<string[]>([]);
  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale, width),
    [locale, width],
  );

  const { data } = useTanstackRequest<{}, ITaskBaseInfo[]>(`task/my`, "GET");

  return (
    <div>
      <div className={styles.topSectionWrapper}>
        <TaskSelect
          label={locale.dashboard.attemptsList.task.label}
          placeholder={locale.dashboard.attemptsList.task.placeholder}
          nothingFound={locale.dashboard.attemptsList.task.nothingFound}
          tasks={data || []}
          select={(tasks: ITaskBaseInfo[] | undefined) => {
            if (tasks) setTaskSearch(tasks.map((task) => task.spec));
            else setTaskSearch([]);
          }}
          additionalProps={{}}
          multiple
        ></TaskSelect>
      </div>
      <AttemptList
        key={taskSearch.toString()}
        url={`attempt/my`}
        activeTab
        initialColumns={(_) => columns}
        refactorAttempt={refactorAttempt}
        empty={<>{locale.profile.empty.attempts}</>}
        noDefault
        classNames={{
          columnSelect: styles.columnSelect,
          searchWrapper: styles.searchWrapper,
          wrapper: tableStyles.wrapper,
          table: tableStyles.table,
          headerCell: styles.headerCell,
          cell: styles.cell,
          even: tableStyles.even,
          odd: tableStyles.odd,
        }}
        taskSearch={taskSearch}
      />
    </div>
  );
};

export default memo(AttemptListProfile);
