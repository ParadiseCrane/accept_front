import { ITask } from '@custom-types/data/ITask';
import { sendRequest } from '@requests/request';
import ComponentToPDF from '@ui/ComponentToPDF/ComponentToPDF';
import { letterFromIndex } from '@utils/letterFromIndex';
import { FC, ReactNode, memo, useCallback, useState } from 'react';

import Description from '../Description/Description';
import styles from './printTasks.module.css';

const PrintTasks: FC<{
  tasks: string[];
  title: ReactNode | string;
  description: ReactNode | string;
}> = ({ tasks: task_specs, title, description }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const beforeHandlePrint = useCallback(
    async () =>
      await sendRequest<string[], ITask[]>(
        'task/ordered-tasks',
        'POST',
        task_specs,
        60000
      ).then((res) => {
        if (!res.error) {
          setTasks(
            res.response.map((task, index) => ({
              ...task,
              title: `${letterFromIndex(index)}. ${task.title}`,
            }))
          );
        }
      }),
    [task_specs]
  );

  return (
    <ComponentToPDF
      title={typeof title == 'string' ? title : undefined}
      component={(ref) => (
        <div ref={ref}>
          <div className={styles.tournamentInfo}>
            {title}
            {description}
          </div>
          {tasks.map((task, index) => (
            <div className={styles.pageWrapper} key={index}>
              <Description task={task} setShowHint={() => false} preview />
            </div>
          ))}
        </div>
      )}
      beforeHandlePrint={beforeHandlePrint}
    />
  );
};

export default memo(PrintTasks);
