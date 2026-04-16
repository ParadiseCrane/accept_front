"use client";
import { ITaskDisplay } from "@custom-types/data/ITask";
import { ILocale } from "@custom-types/ui/ILocale";
import { ITableColumn } from "@custom-types/ui/ITable";
import { useLocale } from "@hooks/useLocale";
import { useUser } from "@hooks/useUser";
import { DefaultLayout } from "@layouts/DefaultLayout";
import tableStyles from "@styles/ui/customTable.module.css";
import { IconUsersGroup } from "@tabler/icons-react";
import { Tip } from "@ui/basics";
import SingularSticky from "@ui/Sticky/SingularSticky";
import TaskList from "@ui/TaskList/TaskList";
import Title from "@ui/Title/Title";
import VerdictWrapper from "@ui/VerdictWrapper/VerdictWrapper";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useViewportSize } from "@mantine/hooks";

const initialColumns = (locale: ILocale, width: number): ITableColumn[] => [
  {
    label: "",
    key: "public",
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.public.value > b.public.value
        ? 1
        : a.public.value == b.public.value
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 1,
  },
  {
    label: locale.task.list.title,
    key: "title",
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
    size: 9,
    minWidth: 20,
  },
  {
    label: locale.task.list.author,
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
    hidable: true,
    hidden: true,
    size: 3,
  },
  {
    label: locale.task.list.complexity,
    key: "complexity",
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.complexity.value > b.complexity.value
        ? 1
        : a.complexity.value == b.complexity.value
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: width <= 425,
    size: 3,
  },
  {
    label: locale.task.list.verdict,
    key: "verdict",
    sortable: true,
    sortFunction: (a: any, b: any) =>
      (a.verdict.value ? a.verdict.value.spec : 100) >
      (b.verdict.value ? b.verdict.value.spec : 100)
        ? 1
        : (a.verdict.value ? a.verdict.value.spec : 100) ==
            (b.verdict.value ? b.verdict.value.spec : 100)
          ? 0
          : -1,
    sorted: 0,
    allowMiddleState: true,
    hidable: true,
    hidden: false,
    size: 2,
  },
];

const refactorTask = (task: ITaskDisplay, locale: ILocale): any => ({
  ...task,
  public: {
    value: task.organization === "public" ? true : false,
    display: task.organization === "public" && (
      <Tip label={locale.task.list.public} spanStyle={tableStyles.spanStyle}>
        <IconUsersGroup className={tableStyles.icon} />
      </Tip>
    ),
  },
  author: {
    value: task.author,
    display: task.author,
  },
  verdict: {
    value: task.verdict,
    display: <VerdictWrapper verdict={task.verdict} />,
  },
  complexity: {
    value: task.complexity,
    display: (
      <span
        style={{
          color:
            task.complexity < 20
              ? "var(--positive)"
              : task.complexity > 80
                ? "var(--negative)"
                : "var(--neutral)",
        }}
      >
        {task.complexity.toString() + "%"}
      </span>
    ),
  },
  title: {
    value: task.title,
    display: (
      <div className={tableStyles.titleWrapper}>
        <Link
          className={tableStyles.title}
          href={`/task/${task.spec}`}
          prefetch={false}
        >
          {task.title}
        </Link>
        {task.tags.length > 0 && (
          <span className={tableStyles.tags}>
            {task.tags.map((tag, idx) =>
              tag.organization === "public" ? (
                <div
                  className={`${tableStyles.tag} ${tableStyles.bold}`}
                  key={idx}
                >
                  <Tip label={locale.task.list.publicTag}>
                    {tag.title + (idx == task.tags.length - 1 ? "" : ", ")}
                  </Tip>
                </div>
              ) : (
                <div className={tableStyles.tag} key={idx}>
                  {tag.title + (idx == task.tags.length - 1 ? "" : ", ")}
                </div>
              ),
            )}
          </span>
        )}
      </div>
    ),
  },
});

function TaskListPage() {
  const { width } = useViewportSize();
  const { isTeacher } = useUser();
  const { locale } = useLocale();
  const columns: ITableColumn[] = useMemo(
    () => initialColumns(locale, width),
    [locale, width],
  );

  return (
    <div>
      <Title title={locale.titles.task.list} />
      <TaskList
        url={"bundle/task_list"}
        refactorTask={(_) => refactorTask(_, locale)}
        initialColumns={(_) => columns}
        sortByPublic={true}
        noDefault
      />
      {isTeacher && (
        <SingularSticky
          href={`/task/add`}
          icon={<IconPlus height={25} width={25} />}
          description={locale.tip.sticky.task.add}
        />
      )}
    </div>
  );
}

TaskListPage.getLayout = (page: ReactNode) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default TaskListPage;
