import { FC, memo, useMemo } from 'react';
import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { IChecker } from '@custom-types/data/ITask';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import { setter } from '@custom-types/ui/atomic';
import OrderTests from './OrderTests/OrderTests';
import MainPage from './MainPage/MainPage';
import { useLocale } from '@hooks/useLocale';
import { Tabs } from '@ui/basics';

const Tests: FC<{
  task_spec: string;
  refetch: setter<boolean>;
  grouped_tests: ITruncatedTaskTest[][];
  truncate_limit: number;
  taskType: ITaskType;
  checkType: ITaskCheckType;
  checker?: IChecker;
}> = ({
  task_spec,
  refetch,
  grouped_tests,
  truncate_limit,
  taskType,
  checkType,
  checker,
}) => {
  const { locale } = useLocale();

  const pages = useMemo(
    () => [
      {
        value: 'main',
        title: locale.task.tests.page.main,
        page: () => (
          <MainPage
            task_spec={task_spec}
            refetch={refetch}
            grouped_tests={grouped_tests}
            truncate_limit={truncate_limit}
            checkType={checkType}
            taskType={taskType}
            checker={checker}
          />
        ),
      },
      {
        value: 'order',
        title: locale.task.tests.page.order,
        page: () => (
          <OrderTests
            task_spec={task_spec}
            refetch={refetch}
            grouped_tests={grouped_tests}
          />
        ),
      },
    ],
    [
      checkType,
      checker,
      locale,
      refetch,
      taskType,
      task_spec,
      grouped_tests,
      truncate_limit,
    ]
  );

  return <Tabs pages={pages} defaultPage={'main'} />;
};

export default memo(Tests);
