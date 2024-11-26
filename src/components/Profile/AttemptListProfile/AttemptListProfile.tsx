import { FC, memo, useState } from 'react';
import styles from './attemptListProfile.module.css';
import tableStyles from '@styles/ui/customTable.module.css';
import { IAttemptDisplay } from '@custom-types/data/IAttempt';
import AttemptList from '@ui/AttemptList/AttemptList';
import { ILocale } from '@custom-types/ui/ILocale';
import { ITableColumn } from '@custom-types/ui/ITable';
import { getLocalDate } from '@utils/datetime';
import Link from 'next/link';
import { useLocale } from '@hooks/useLocale';
import VerdictWrapper from '@ui/VerdictWrapper/VerdictWrapper';
import { TaskSelect } from '@ui/selectors';
import { useRequest } from '@hooks/useRequest';
import { ITaskBaseInfo } from '@custom-types/data/ITask';
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
      <Link className={tableStyles.link} href={`/attempt/${attempt.spec}`}>
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
      <Link href={`/task/${attempt.task.spec}`} className={styles.taskLink}>
        {attempt.task.title}
      </Link>
    ),
    value: attempt.task,
  },
});

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.attempt.date,
    key: 'date',
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
    key: 'task',
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
    key: 'language',
    sortable: false,
    sortFunction: (_: any, __: any) => 0,
    sorted: 0,
    allowMiddleState: true,
    hidable: false,
    hidden: false,
    size: 2,
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

const AttemptListProfile: FC<{}> = ({}) => {
  const { locale } = useLocale();
  const [taskSearch, setTaskSearch] = useState<string[]>([]);

  const { data } = useRequest<{}, ITaskBaseInfo[]>(`task/my`, 'GET');

  return (
    <div>
      <TaskSelect
        label={locale.dashboard.attemptsList.task.label}
        placeholder={locale.dashboard.attemptsList.task.placeholder}
        nothingFound={locale.dashboard.attemptsList.task.nothingFound}
        tasks={data || []}
        select={(tasks: ITaskBaseInfo[] | undefined) => {
          if (tasks) setTaskSearch(tasks.map((task) => task.spec));
          else setTaskSearch([]);
        }}
        multiple
      ></TaskSelect>
      <AttemptList
        key={taskSearch.toString()}
        url={`attempt/my`}
        activeTab
        initialColumns={initialColumns}
        refactorAttempt={refactorAttempt}
        empty={<>{locale.profile.empty.attempts}</>}
        noDefault
        classNames={{
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
