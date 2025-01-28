import { ICourseAdd, ICourseResponse } from '@custom-types/data/ICourse';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Group, Stack } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { Button, CustomEditor } from '@ui/basics';
import ImageSelector from '@ui/ImageSelector';
import { CourseTree } from '@ui/CourseTree';
import { FC, memo } from 'react';
import styles from './styles.module.css';

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: ICourseAdd;
  buttonLabel: string;
  shouldNotify: boolean;
  editMode: boolean;
}> = ({ handleSubmit, initialValues, buttonLabel, shouldNotify, editMode }) => {
  const { locale } = useLocale();
  const form = useForm<ICourseAdd>({ initialValues: initialValues });
  return (
    <Stack m={'xl'} className={styles.form}>
      <Group grow align="flex-start">
        <CourseTree
          titleProps={{ ...form.getInputProps('title') }}
          initialUnits={form.values.children}
          form={form}
        />
        <ImageSelector />
      </Group>
      {/* TODO: Add locale */}
      <CustomEditor
        label={locale.assignmentSchema.form.description}
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
