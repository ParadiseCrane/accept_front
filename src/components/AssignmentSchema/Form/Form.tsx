import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType, useForm } from '@mantine/form';
import Stepper from '@ui/Stepper/Stepper';
import { FC, memo, useEffect, useMemo } from 'react';

import MainInfo from './MainInfo/MainInfo';
import Preview from './Preview/Preview';
import TaskAdding from './TaskAdding/TaskAdding';
import { TaskOrdering } from './TaskOrdering/TaskOrdering';

const stepFields = [['title', 'description', 'tags'], ['tasks'], [], []];

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: any;
  buttonLabel: string;
}> = ({ handleSubmit, buttonLabel, initialValues }) => {
  const { locale } = useLocale();

  const form = useForm({
    initialValues,
    validate: {
      title: (value) =>
        value.length < 5 ? locale.assignmentSchema.form.validation.title : null,
      description: (value) =>
        value.length < 20
          ? locale.assignmentSchema.form.validation.description
          : null,
      tags: (value) =>
        value.length < 1 ? locale.assignmentSchema.form.validation.tags : null,
      tasks: (value) =>
        value
          ? value.length === 0
            ? locale.assignmentSchema.form.validation.tasks
            : null
          : locale.assignmentSchema.form.validation.tasks,
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    form.setValues(initialValues);
  }, [initialValues]); //eslint-disable-line

  const initialTasks = useMemo(
    () => form.values.tasks,
    [form.values.tasks.length] //eslint-disable-line
  );

  return (
    <>
      <Stepper
        stepFields={stepFields}
        form={form}
        buttonLabel={buttonLabel}
        handleSubmit={() => handleSubmit(form)}
        pages={[
          <MainInfo key={'0'} form={form} />,
          <TaskAdding key={'1'} form={form} initialTasks={initialTasks} />,
          <TaskOrdering key={'2'} form={form} />,
          <Preview key={'3'} form={form} />,
        ]}
        labels={locale.assignmentSchema.form.steps.labels}
        descriptions={locale.assignmentSchema.form.steps.descriptions}
      />
    </>
  );
};

export default memo(Form);
