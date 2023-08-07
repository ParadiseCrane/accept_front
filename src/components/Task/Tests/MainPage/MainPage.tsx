import { FC, memo, useCallback, useMemo } from 'react';
import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import { IChecker } from '@custom-types/data/ITask';
import { setter } from '@custom-types/ui/atomic';
import GroupContent from './GroupContent/GroupContent';
import stepperStyles from '@styles/ui/stepper.module.css';
import { useLocale } from '@hooks/useLocale';
import DeleteGroup from './DeleteGroup/DeleteGroup';
import styles from './mainPage.module.css';
import { Button } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';

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
  const { locale, lang } = useLocale();
  const group_last_elements = useMemo(
    () =>
      grouped_tests.reduce(
        (acc, value) => [...acc, (acc.at(-1) || 0) + value.length],
        [0]
      ),
    [grouped_tests]
  );

  const addGroup = useCallback(() => {
    requestWithNotify<undefined, boolean>(
      `test_group/${task_spec}`,
      'POST',
      locale.notify.test_group.post,
      lang,
      () => '',
      undefined,
      (response) => {
        if (response) {
          refetch(false);
        }
      }
    );
  }, [task_spec, locale, lang, refetch]);

  return (
    <div className={stepperStyles.wrapper}>
      {grouped_tests.map((tests, index) => (
        <div key={index} className={styles.groupWrapper}>
          <div className={styles.groupLabelWrapper}>
            {`${locale.task.tests.group} #${index + 1}`}{' '}
            <DeleteGroup
              task_spec={task_spec}
              index={index}
              refetch={refetch}
            />
          </div>
          <GroupContent
            group_index={index}
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
      <Button
        onClick={addGroup}
        disabled={
          grouped_tests.length == 0 ||
          grouped_tests.at(-1)?.length == 0
        }
      >
        Добавить группу
      </Button>
    </div>
  );
};

export default memo(MainPage);
