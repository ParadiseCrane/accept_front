import { FC, memo, useMemo } from 'react';
import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import { IChecker } from '@custom-types/data/ITask';
import { setter } from '@custom-types/ui/atomic';
import GroupContent from './GroupContent/GroupContent';
import stepperStyles from '@styles/ui/stepper.module.css';

const MainPage: FC<{
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
  const group_last_elements = useMemo(
    () =>
      grouped_tests.reduce(
        (acc, value) => [...acc, (acc.at(-1) || 0) + value.length],
        [0]
      ),
    [grouped_tests]
  );

  return (
    <div className={stepperStyles.wrapper}>
      {grouped_tests.map((tests, index) => (
        <div
          key={index}
          style={{
            marginBottom: 'var(--spacer-xl)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--font-size-l)',
              marginBottom: 'var(--spacer-l)',
            }}
          >
            {`Группа #${index + 1}`}
          </div>
          <GroupContent
            test_offset={group_last_elements[index]}
            task_spec={task_spec}
            refetch={refetch}
            tests={tests}
            truncate_limit={truncate_limit}
            taskType={taskType}
            checkType={checkType}
            checker={checker}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(MainPage);
