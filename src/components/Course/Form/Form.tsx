import { ICourseAddEdit, ICourseResponse } from '@custom-types/data/ICourse';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Group, Stack } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { Button, CustomEditor } from '@ui/basics';
import { CourseTree } from '@ui/CourseTree/CourseTree';
import ImageSelector from '@ui/ImageSelector/ImageSelector';
import { FC, memo } from 'react';

import styles from './styles.module.css';

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: ICourseAddEdit;
  buttonLabel: string;
  shouldNotify: boolean;
  editMode: boolean;
  depth: number;
}> = ({
  handleSubmit,
  initialValues,
  buttonLabel,
  shouldNotify,
  editMode,
  depth,
}) => {
  const { locale } = useLocale();
  const form = useForm<ICourseAddEdit>({ initialValues: initialValues });
  return (
    <Stack m={'xl'} className={styles.form}>
      <Group grow align="flex-start">
        <CourseTree
          titleProps={{ ...form.getInputProps('title') }}
          initialUnits={form.values.children}
          form={form}
          depth={depth}
        />
        {form.values.kind === 'course' && <ImageSelector form={form} />}
      </Group>
      <CustomEditor
        label={locale.course.description}
        form={form}
        name="description"
      />
      <Button
        onClick={() => {
          handleSubmit(form);
        }}
      >
        {editMode ? locale.edit : locale.create}
      </Button>
    </Stack>
  );
};

export default memo(Form);
