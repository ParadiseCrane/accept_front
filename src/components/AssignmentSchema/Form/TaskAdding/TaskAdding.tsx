import { Item } from '@custom-types/ui/atomic';

import { FC, memo, useCallback } from 'react';
import { TaskSelector } from '@ui/selectors';
import { InputWrapper } from '@ui/basics';

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
      <InputWrapper {...form.getInputProps('tasks')}>
        <TaskSelector initialTasks={initialTasks} setUsed={setUsed} />
      </InputWrapper>
    </>
  );
};

export default memo(TaskAdding);
