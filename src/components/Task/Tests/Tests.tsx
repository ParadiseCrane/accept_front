import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { IChecker } from '@custom-types/data/ITask';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Tabs } from '@ui/basics';
import { FC, memo, useMemo } from 'react';

import MainPage from './MainPage/MainPage';
import OrderTests from './OrderTests/OrderTests';

const Tests: FC<{
  task_spec: string;
  refetch: setter<boolean>;
  grouped_tests: ITruncatedTaskTest[][];
  truncate_limit: number;
  taskType: ITaskType;
  checkType: ITaskCheckType;
  checker?: IChecker;
  hasWriteRights: boolean;
}> = ({
  task_spec,
  refetch,
  grouped_tests,
  truncate_limit,
  taskType,
  checkType,
  checker,
  hasWriteRights,
}) => {
  const { locale } = useLocale();

  const pages = useMemo(() => {
    let innerPages = [
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
            hasWriteRights={hasWriteRights}
          />
        ),
      },
    ];

    if (hasWriteRights) {
      innerPages.push({
        value: 'order',
        title: locale.task.tests.page.order,
        page: () => (
          <OrderTests
            task_spec={task_spec}
            refetch={refetch}
            grouped_tests={grouped_tests}
          />
        ),
      });
    }

    return innerPages;
  }, [
    checkType,
    checker,
    locale,
    refetch,
    taskType,
    task_spec,
    grouped_tests,
    truncate_limit,
    hasWriteRights,
  ]);

  const testsHash = useMemo(
    () =>
      grouped_tests
        .map(
          (group) =>
            group.length.toString() + group.map((item) => item.spec.slice(3))
        )
        .join(),
    [grouped_tests]
  );

  return <Tabs key={testsHash} pages={pages} defaultPage={'main'} />;
};

export default memo(Tests);
