import { ITaskCheckType, ITaskType } from '@custom-types/data/atomic';
import { IChecker } from '@custom-types/data/ITask';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';
import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import stepperStyles from '@styles/ui/stepper.module.css';
import { Button } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useMemo } from 'react';

import DeleteGroup from './DeleteGroup/DeleteGroup';
import GroupContent from './GroupContent/GroupContent';
import styles from './mainPage.module.css';

const MainPage: FC<{
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
      <div className={styles.groupsWrapper}>
        {grouped_tests.map((tests, index) => (
          <div key={index} className={styles.groupWrapper}>
            <div className={styles.groupLabelWrapper}>
              {`${locale.task.tests.group.label} #${index + 1}`}{' '}
              {hasWriteRights && (
                <DeleteGroup
                  task_spec={task_spec}
                  index={index}
                  refetch={refetch}
                />
              )}
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
              hasWriteRights={hasWriteRights}
            />
          </div>
        ))}
      </div>
      {hasWriteRights && (
        <Button
          variant="outline"
          kind="positive"
          onClick={addGroup}
          fullWidth
          disabled={
            grouped_tests.length == 0 || grouped_tests.at(-1)?.length == 0
          }
          dropdownContent={locale.helpers.taskTest.group.add}
        >
          {locale.task.tests.group.add}
        </Button>
      )}
    </div>
  );
};

export default memo(MainPage);
