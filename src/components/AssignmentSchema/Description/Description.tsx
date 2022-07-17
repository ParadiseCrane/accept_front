import { FC, useEffect, useRef, useState } from 'react';
import { ITaskDisplay } from '@custom-types/data/ITask';
import styles from './description.module.css';
import { useLocale } from '@hooks/useLocale';
import PrimitiveTable from '@ui/PrimitiveTable/PrimitiveTable';
import { IAssignmentSchema } from '@custom-types/data/IAssignmentSchema';
import { sendRequest } from '@requests/request';

const Description: FC<{ assignment: IAssignmentSchema }> = ({
  assignment,
}) => {
  const description = useRef<HTMLDivElement>(null);
  const { locale } = useLocale();

  const [tasks, setTasks] = useState<ITaskDisplay[]>([]);

  useEffect(() => {
    if (description.current)
      description.current.innerHTML = assignment.description;
  }, [assignment.description]);

  useEffect(() => {
    let cleanUp = false;
    if (assignment.tasks.length)
      sendRequest<string[], ITaskDisplay[]>(
        'task/task-spec-list',
        'POST',
        assignment.tasks,
        5000
      ).then((res) => {
        if (!cleanUp && !res.error) {
          const response = res.response;
          const tasks = new Map<string, ITaskDisplay>();
          for (let i = 0; i < response.length; i++) {
            tasks.set(response[i].spec, response[i]);
          }
          setTasks(
            assignment.tasks.map((spec) => tasks.get(spec) || null!)
          );
        }
      });

    return () => {
      cleanUp = true;
    };
  }, [assignment.tasks]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{assignment.title}</div>
      <div className={styles.description} ref={description}>
        {assignment.description}
      </div>
      <div>
        <PrimitiveTable
          columns={[
            locale.task.list.title,
            locale.task.list.author,
            locale.task.list.grade,
            locale.task.list.verdict,
          ]}
          rows={tasks}
          rowComponent={(row: any) => {
            return (
              <>
                <td className={styles.cell}>
                  <a
                    href={`/task/${row.spec}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.tableTitle}
                  >
                    {row.title}
                  </a>
                </td>
                <td className={styles.cell}>{row.author}</td>
                <td className={styles.cell}>{row.grade}</td>
                <td className={styles.cell}>{row.verdict || '-'}</td>
              </>
            );
          }}
          classNames={{
            column: styles.column,
            row: styles.row,
            table: styles.tableWrapper,
            even: styles.even,
          }}
        />
      </div>
    </div>
  );
};

export default Description;
