import { IBarTask } from '@custom-types/data/ITask';
import { ActionIcon } from '@mantine/core';
import Link from 'next/link';
import { FC, memo } from 'react';
import { Home } from 'tabler-icons-react';
import styles from './tasksBar.module.css';
import { letterFromIndex } from '@utils/letterFromIndex';

const TasksBar: FC<{
  tasks: IBarTask[];
  homeHref: string;
  taskQuery: string;
  currentTask: string;
}> = ({ tasks, homeHref, taskQuery, currentTask }) => {
  return (
    <>
      {tasks.length > 0 && (
        <div className={styles.wrapper}>
          <ActionIcon
            className={styles.taskStatus}
            style={{
              backgroundColor: 'var(--primary)',
            }}
            component="a"
            href={homeHref}
          >
            <Home color="white" />
          </ActionIcon>
          {tasks.map((task, index) => (
            <Link
              href={`/task/${task.spec}?${taskQuery}`}
              key={index}
              className={`${styles.taskStatus} ${
                task.status && task.status.spec < 2
                  ? styles.testing
                  : !task.verdict
                  ? styles.null
                  : task.verdict.shortText == 'OK'
                  ? styles.ok
                  : styles.err
              } ${currentTask == task.spec ? styles.current : ''}`}
            >
              {letterFromIndex(index)}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default memo(TasksBar);
