import React, { FC, memo, useCallback, useMemo } from 'react';
import { Select } from '@ui/basics';
import { TaskItemProps, TaskSelectProps } from './TaskSelect';
import { SelectItem } from '@custom-types/ui/atomic';

const TaskSingleSelect: FC<TaskSelectProps> = ({
  label,
  placeholder,
  tasks,
  nothingFound,
  select,
  multiple, //eslint-disable-line
  additionalProps,
}) => {
  const data = useMemo(
    () =>
      tasks.map(
        (item) =>
          ({
            label: item.title,
            value: item.spec,
          } as TaskItemProps)
      ),
    [tasks]
  );

  const onSelect = useCallback(
    (spec: string | null) => {
      if (!spec) {
        select(undefined);
        return;
      }
      const taskIndex = tasks.findIndex((item) => item.spec === spec);
      if (taskIndex >= 0) {
        select([tasks[taskIndex]]);
      }
    },
    [select, tasks]
  );

  return (
    <>
      <Select
        searchable
        data={data}
        label={label}
        placeholder={placeholder}
        clearable
        maxDropdownHeight={400}
        nothingFound={nothingFound}
        filter={(value: string, item: SelectItem) =>
          item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.value.toLowerCase().includes(value.toLowerCase().trim())
        }
        {...additionalProps}
        onChange={(spec) => {
          onSelect(spec);
          additionalProps?.onChange(spec);
        }}
      />
    </>
  );
};

export default memo(TaskSingleSelect);
