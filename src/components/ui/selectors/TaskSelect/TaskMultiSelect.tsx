import React, { FC, memo, useCallback, useMemo } from 'react';
import { MultiSelect } from '@ui/basics';
import { TaskItemProps, TaskSelectProps } from './TaskSelect';
import { ITaskDisplay } from '@custom-types/data/ITask';
import { SelectItem } from '@custom-types/ui/atomic';
import { ComboboxItem } from '@mantine/core';

const TaskMultiSelect: FC<TaskSelectProps> = ({
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
    (specs: string[]) => {
      if (specs.length == 0) {
        select([]);
        return;
      }
      const map = new Map(tasks.map((item) => [item.spec, item]));
      select(specs.map((spec) => map.get(spec) as ITaskDisplay));
    },
    [select, tasks]
  );

  return (
    <>
      <MultiSelect
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
        onChange={(specs) => {
          onSelect(specs);
          additionalProps?.onChange(specs);
        }}
      />
    </>
  );
};

export default memo(TaskMultiSelect);
