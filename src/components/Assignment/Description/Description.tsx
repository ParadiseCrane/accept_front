import { IAssignment } from '@custom-types/data/IAssignment';
import { ITaskDisplay } from '@custom-types/data/ITask';
import { useLocale } from '@hooks/useLocale';
import { sendRequest } from '@requests/request';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import PrimitiveTaskTable from '@ui/PrimitiveTaskTable/PrimitiveTaskTable';
import { getLocalDate } from '@utils/datetime';
import { letterFromIndex } from '@utils/letterFromIndex';
import { FC, memo, useEffect, useState } from 'react';

import styles from './description.module.css';

const Description: FC<{ assignment: IAssignment }> = ({ assignment }) => {
  const { locale } = useLocale();
  const [startDate, setStartDate] = useState('-');
  const [endDate, setEndDate] = useState('-');

  const [tasks, setTasks] = useState(assignment.tasks);

  useEffect(() => {
    setStartDate(getLocalDate(assignment.start));
    setEndDate(getLocalDate(assignment.end));
  }, [assignment.end, assignment.start]);

  useEffect(() => {
    let cleanUp = false;
    if (assignment.tasks.length) {
      sendRequest<string[], ITaskDisplay[]>(
        'task/list-specs',
        'POST',
        assignment.tasks.map((task: any) => task.value || task.spec),
        5000
      ).then((res) => {
        if (!cleanUp && !res.error) {
          setTasks(
            res.response.map((task, index) => ({
              ...task,
              title: `${letterFromIndex(index)}. ${task.title}`,
            }))
          );
        }
      });
    }
    return () => {
      cleanUp = true;
    };
  }, [assignment.tasks]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{assignment.title}</div>
        <div className={styles.info}>
          <div className={styles.usersInfo}>
            <div className={styles.author}>
              {locale.assignment.form.author}: {assignment.author}
            </div>
            <div className={styles.starter}>
              {locale.assignment.form.creator}: {assignment.starter}
            </div>
          </div>
          {assignment.infinite ? (
            <div className={styles.duration}>
              {locale.assignment.form.infinite}
            </div>
          ) : (
            <div>
              <div className={styles.duration}>
                {locale.assignment.form.startTime}: {startDate}
              </div>
              <div className={styles.duration}>
                {locale.assignment.form.endTime}: {endDate}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.description}>
        <TipTapEditor
          editorMode={false}
          content={assignment.description}
          onUpdate={() => {}}
        />
      </div>

      <div className={styles.tasksWrapper}>
        <PrimitiveTaskTable
          tasks={tasks}
          linkQuery={`assignment=${assignment.spec}`}
          empty={locale.tournament.emptyTasks}
        />
      </div>
    </div>
  );
};

export default memo(Description);
