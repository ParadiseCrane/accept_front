import React, { FC, memo, useCallback, useMemo } from 'react';
import { MultiSelect } from '@ui/basics';
import { TaskItemProps, TaskSelectProps } from './TaskSelect';
import { ITaskDisplay } from '@custom-types/data/ITask';
import { SelectItem } from '@custom-types/ui/atomic';

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
        nothingFound={nothingFound}
        filter={(value: string, selected: boolean, item: SelectItem) =>
          item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.value.toLowerCase().includes(value.toLowerCase().trim())
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
