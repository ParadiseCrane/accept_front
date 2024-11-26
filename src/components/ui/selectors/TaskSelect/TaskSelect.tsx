import React, { FC, memo } from 'react';
import { ITaskBaseInfo } from '@custom-types/data/ITask';
import TaskMultiSelect from './TaskMultiSelect';
import TaskSingleSelect from './TaskSingleSelect';

export interface TaskItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  role: string;
  value: string;
}

export interface TaskSelectProps {
  label: string;
  placeholder: string;
  nothingFound: string;
  tasks: ITaskBaseInfo[];
  select: (_: ITaskBaseInfo[] | undefined) => void;
  additionalProps?: any;
  multiple?: boolean;
}

const TaskSelect: FC<TaskSelectProps> = ({ multiple, ...props }) => {
  if (multiple) return <TaskMultiSelect {...props} />;
  return <TaskSingleSelect {...props} />;
};

export default memo(TaskSelect);
