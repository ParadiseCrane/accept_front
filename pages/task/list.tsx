import { ITableColumn } from '@custom-types/ui/ITable';
import { ITaskDisplay } from '@custom-types/data/ITask';
import { DefaultLayout } from '@layouts/DefaultLayout';
import { ReactNode } from 'react';
import tableStyles from '@styles/ui/customTable.module.css';
import { ILocale } from '@custom-types/ui/ILocale';
import TaskList from '@ui/TaskList/TaskList';
import SingularSticky from '@ui/Sticky/SingularSticky';
import { Plus } from 'tabler-icons-react';
import { useUser } from '@hooks/useUser';
import Title from '@ui/Title/Title';
import { useLocale } from '@hooks/useLocale';
import VerdictWrapper from '@ui/VerdictWrapper/VerdictWrapper';
import Link from 'next/link';

const initialColumns = (locale: ILocale): ITableColumn[] => [
  {
    label: locale.task.list.title,
    key: 'title',
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
  },
  {
    label: locale.task.list.author,
    key: 'author',
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
    key: 'complexity',
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
    hidden: false,
    size: 3,
  },
  {
    label: locale.task.list.verdict,
    key: 'verdict',
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
const refactorTask = (task: ITaskDisplay): any => ({
  ...task,
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
              ? 'var(--positive)'
              : task.complexity > 80
              ? 'var(--negative)'
              : 'var(--neutral)',
        }}
      >
        {task.complexity.toString() + '%'}
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
        >
          {task.title}
        </Link>
        {task.tags.length > 0 && (
          <span className={tableStyles.tags}>
            {task.tags.map((tag, idx) => (
              <div className={tableStyles.tag} key={idx}>
                {tag.title +
                  (idx == task.tags.length - 1 ? '' : ', ')}
              </div>
            ))}
          </span>
        )}
      </div>
    ),
  },
});

function TaskListPage() {
  const { isTeacher } = useUser();
  const { locale } = useLocale();
  return (
    <div>
      <Title title={locale.titles.task.list} />
      <TaskList
        url={'bundle/task_list'}
        refactorTask={refactorTask}
        initialColumns={initialColumns}
      />
      {isTeacher && (
        <SingularSticky
          href={`/task/add`}
          icon={<Plus height={25} width={25} />}
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
