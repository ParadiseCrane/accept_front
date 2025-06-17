import { ILesson } from '@custom-types/data/ICourse';
import { FC, memo } from 'react';

import styles from './styles.module.css';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import { useLocale } from '@hooks/useLocale';
import PrimitiveTaskTable from '@ui/PrimitiveTaskTable/PrimitiveTaskTable';

interface Props {
  lesson: ILesson;
}

const Lesson: FC<Props> = ({ lesson }) => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{lesson.title}</div>
      </div>
      <div className={styles.description}>
        <TipTapEditor
          editorMode={false}
          content={lesson.description}
          onUpdate={() => {}}
        />
      </div>

      <div className={styles.tasksWrapper}>
        <PrimitiveTaskTable
          tasks={lesson.tasks}
          linkQuery={`assignment=${lesson.spec}`}
          empty={locale.tournament.emptyTasks}
        />
      </div>
    </div>
  );
};

export default memo(Lesson);
