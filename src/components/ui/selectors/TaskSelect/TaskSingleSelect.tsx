import { SelectItem } from '@custom-types/ui/atomic';
import { ComboboxItem } from '@mantine/core';
import { Select } from '@ui/basics';
import React, { FC, memo, useCallback, useMemo } from 'react';

import { TaskItemProps, TaskSelectProps } from './TaskSelect';

const TaskSingleSelect: FC<TaskSelectProps> = ({
  label,
  placeholder,
  tasks,
  nothingFound,
  select,
  multiple,
  additionalProps,
}) => {
  const data = useMemo(
    () =>
      tasks.map(
        (item) =>
          ({
            label: item.title,
            value: item.spec,
          }) as TaskItemProps
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
        nothingFoundMessage={nothingFound}
        filter={({ options, search }) =>
          (options as ComboboxItem[]).filter(
            (item) =>
              item.label?.toLowerCase().includes(search.toLowerCase().trim()) ||
              item.value.toLowerCase().includes(search.toLowerCase().trim())
          )
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
