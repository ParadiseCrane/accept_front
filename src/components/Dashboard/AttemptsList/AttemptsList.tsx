import { FC, memo, useCallback, useState } from 'react';
import styles from './attemptsList.module.css';
import tableStyles from '@styles/ui/customTable.module.css';
import { IAttemptDisplay } from '@custom-types/data/IAttempt';
import { default as AttemptListUI } from '@ui/AttemptList/AttemptList';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { getLocalDate } from '@utils/datetime';
import Link from 'next/link';
import { useLocale } from '@hooks/useLocale';
import { SegmentedControl } from '@ui/basics';
import { useRequest } from '@hooks/useRequest';
import { ITasksUsersBundle } from '@custom-types/data/bundle';
import { TaskSelect, UserSelect } from '@ui/selectors';
import { IUserDisplay } from '@custom-types/data/IUser';
import { ITaskBaseInfo } from '@custom-types/data/ITask';
import VerdictWrapper from '@ui/VerdictWrapper/VerdictWrapper';

const refactorAttempt = (
  attempt: IAttemptDisplay,
  type: string,
  spec: string
): any => ({
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
      <a
        className={tableStyles.link}
        href={`/attempt/${attempt.spec}`}
      >
        {getLocalDate(attempt.date)}
      </a>
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
        href={`/task/${attempt.task.spec}?${type}=${spec}`}
        passHref
        className={styles.taskLink}
      >
        {attempt.task.title}
      </Link>
    ),
    value: attempt.task,
  },
  author: {
    display: (
      <div className={tableStyles.titleWrapper}>
        <a
          className={tableStyles.link}
          href={`/profile/${attempt.author}`}
        >
          {attempt.author}
        </a>
      </div>
    ),
    value: attempt.author,
  },
});

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.attempt.date,
    key: 'date',
    sortable: true,
    sortFunction: (a: any, b: any) =>
      a.date.value > b.date.value
        ? -1
        : a.date.value == b.date.value
        ? 0
        : 1,
    sorted: -1,
    allowMiddleState: false,
    hidable: false,
    hidden: false,
    size: 3,
  },
  {
    label: locale.attempt.author,
    key: 'author',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: false,
    hidable: false,
    hidden: false,
    size: 3,
  },
  {
    label: locale.attempt.task,
    key: 'task',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: false,
    hidable: false,
    hidden: false,
    size: 6,
  },
  {
    label: locale.attempt.language,
    key: 'language',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 3,
  },
  {
    label: locale.attempt.result,
    key: 'result',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
  },
];

const AttemptList: FC<{
  spec: string;
  shouldNotRefetch: boolean;
  isFinished: boolean;
  endDate: Date;
  type: 'assignment' | 'tournament' | 'current';
  banned?: boolean;
}> = ({
  spec,
  shouldNotRefetch,
  isFinished,
  endDate,
  type,
  banned,
}) => {
  const { locale } = useLocale();
  const [userSearch, setUserSearch] = useState<string[]>([]);
  const [taskSearch, setTaskSearch] = useState<string[]>([]);

  const [fetchDate, setFetchDate] = useState<'actual' | 'end'>(
    isFinished ? 'end' : 'actual'
  );
  const refactor = useCallback(
    (attempt: IAttemptDisplay) =>
      refactorAttempt(attempt, type, spec),
    [type, spec]
  );

  const { data } = useRequest<{}, ITasksUsersBundle>(
    `${type}/bundle/tasks-users/${spec}`,
    'GET',
    undefined
  );

  return (
    <div className={styles.wrapper}>
      {isFinished && (
        <SegmentedControl
          data={[
            {
              label: locale.dashboard.assignment.toDate.end,
              value: 'end',
            },
            {
              label: locale.dashboard.assignment.toDate.actual,
              value: 'actual',
            },
          ]}
          value={fetchDate}
          onChange={(value) =>
            setFetchDate(value as 'actual' | 'end')
          }
        />
      )}
      <div className={styles.selectors}>
        <UserSelect
          label={locale.dashboard.attemptsList.user.label}
          placeholder={locale.dashboard.attemptsList.user.placeholder}
          nothingFound={
            locale.dashboard.attemptsList.user.nothingFound
          }
          users={data?.users || []}
          select={(users: IUserDisplay[] | undefined) => {
            if (users) setUserSearch(users.map((user) => user.login));
            else setUserSearch([]);
          }}
          multiple
        />
        <TaskSelect
          label={locale.dashboard.attemptsList.task.label}
          placeholder={locale.dashboard.attemptsList.task.placeholder}
          nothingFound={
            locale.dashboard.attemptsList.task.nothingFound
          }
          tasks={data?.tasks || []}
          select={(tasks: ITaskBaseInfo[] | undefined) => {
            if (tasks) setTaskSearch(tasks.map((task) => task.spec));
            else setTaskSearch([]);
          }}
          multiple
        />
      </div>
      <AttemptListUI
        key={userSearch.toString() + taskSearch.toString()}
        url={
          type == 'current'
            ? 'attempt/current-list'
            : `${type}/attempts${banned ? '-banned' : ''}/${spec}`
        }
        activeTab
        initialColumns={initialColumns}
        refactorAttempt={refactor}
        toDate={fetchDate == 'end' ? endDate : undefined}
        empty={<>{locale.dashboard.attemptsList.empty}</>}
        noDefault
        shouldNotRefetch={shouldNotRefetch}
        classNames={{
          wrapper: tableStyles.wrapper,
          table: tableStyles.table,
          headerCell: styles.headerCell,
          cell: styles.cell,
          even: tableStyles.even,
          odd: tableStyles.odd,
        }}
        userSearch={userSearch}
        taskSearch={taskSearch}
      />
    </div>
  );
};

export default memo(AttemptList);
