import { useLocale } from '@hooks/useLocale';
import stepperStyles from '@styles/ui/stepper.module.css';
import { CustomDraggableList } from '@ui/CustomDraggableList/CustomDraggableList';
import { FC } from 'react';

import styles from './taskOrdering.module.css';

export const TaskOrdering: FC<{
  form: any;
}> = ({ form }) => {
  const { locale } = useLocale();
  return (
    <>
      <div className={stepperStyles.label}>
        {locale.assignmentSchema.form.taskOrdering.title}
      </div>
      <CustomDraggableList
        values={form.values.tasks}
        setValues={(values) => form.setFieldValue('tasks', values)}
        classNames={{
          wrapper: styles.wrapperList,
        }}
      />
    </>
  );
};
