import { FC, useEffect, useState } from 'react';
import { ITaskDisplay } from '@custom-types/data/ITask';
import styles from './description.module.css';
import { useLocale } from '@hooks/useLocale';
import { IAssignmentSchema } from '@custom-types/data/IAssignmentSchema';
import { sendRequest } from '@requests/request';
import TagList from '@ui/TagList/TagList';
import { LoadingOverlay } from '@ui/basics';
import PrimitiveTaskTable from '@ui/PrimitiveTaskTable/PrimitiveTaskTable';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';

const Description: FC<{
  assignment: IAssignmentSchema;
  preview?: boolean;
}> = ({ assignment, preview }) => {
  const { locale } = useLocale();

  const [tasks, setTasks] = useState<ITaskDisplay[]>(
    preview ? [] : assignment.tasks
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cleanUp = false;
    if (assignment.tasks.length) {
      setLoading(!!preview);
      sendRequest<string[], ITaskDisplay[]>(
        'task/list-specs',
        'POST',
        assignment.tasks.map((task: any) => task.value || task.spec),
        5000
      ).then((res) => {
        if (!cleanUp && !res.error) {
          setTasks(res.response);
          setLoading(false);
        }
      });
    }
    return () => {
      cleanUp = true;
    };
  }, [assignment.tasks, preview]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{assignment.title}</div>
        <div className={styles.info}>
          <div
            className={styles.author}
          >{`${locale.assignment.form.author}: ${assignment.author}`}</div>
        </div>
      </div>
      <div className={styles.tags}>
        <TagList tags={assignment.tags} />
      </div>
      <div
        className={styles.description}
        children={
          <TipTapEditor
            editorMode={false}
            content={assignment.description}
            onUpdate={() => {}}
          />
        }
      ></div>
      <div
        style={{
          position: 'relative',
          paddingBottom: 'var(--spacer-l)',
        }}
      >
        <LoadingOverlay visible={loading} />
        <PrimitiveTaskTable tasks={tasks} linkQuery={``} />
      </div>
    </div>
  );
};

export default Description;
