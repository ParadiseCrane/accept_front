import { Item } from '@custom-types/ui/atomic';

import { FC, memo, useCallback } from 'react';
import { TaskSelector } from '@ui/selectors';

const TaskAdding: FC<{ form: any; initialTasks: Item[] }> = ({
  form,
  initialTasks,
}) => {
  const setUsed = useCallback(
    (tasks: Item[]) => form.setFieldValue('tasks', tasks),
    [form.setFieldValue] // eslint-disable-line
  );
  return (
    <>
      <TaskSelector
        initialTasks={initialTasks}
        setUsed={setUsed}
        {...form.getInputProps('tasks')}
      />
    </>
  );
};

export default memo(TaskAdding);
