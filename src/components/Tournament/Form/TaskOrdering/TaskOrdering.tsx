import { FC, memo } from 'react';
import { CustomDraggableList } from '@ui/CustomDraggableList/CustomDraggableList';
import { useLocale } from '@hooks/useLocale';
import styles from './taskOrdering.module.css';
import stepperStyles from '@styles/ui/stepper.module.css';
import { ITaskDisplay } from '@custom-types/data/ITask';

const TaskOrdering: FC<{ form: any }> = ({ form }) => {
  const { locale } = useLocale();

  return (
    <>
      {form.values.tasks.length == 0 ? (
        <>{locale.tournament.form.zeroTask}</>
      ) : (
        <>
          <div className={stepperStyles.label}>
            {locale.tournament.form.taskOrdering}
          </div>
          <CustomDraggableList
            values={
              form.values.tasks.map((task: ITaskDisplay) => ({
                label: task.title,
                value: task,
              })) || []
            }
            setValues={(values) =>
              form.setFieldValue(
                'tasks',
                values.map((value) => value.value)
              )
            }
            classNames={{
              wrapper: styles.wrapperList,
              dragButton: styles.dragButton,
            }}
          />
        </>
      )}
    </>
  );
};

export default memo(TaskOrdering);
