import { ICourseAdd, ICourseResponse } from '@custom-types/data/ICourse';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Group, Stack } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { Button, CustomEditor } from '@ui/basics';
import ImageSelector from '@ui/ImageSelector';
import { CourseTree } from '@ui/CourseTree';
import { FC, memo, useState } from 'react';

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: ICourseAdd;
  buttonLabel: string;
  shouldNotify: boolean;
}> = ({ handleSubmit, initialValues, buttonLabel, shouldNotify }) => {
  const { locale } = useLocale();
  const form = useForm<ICourseAdd>({ initialValues: initialValues });
  return (
    <Stack m={'xl'} maw={'80%'}>
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
        title="Send"
        onClick={() => {
          handleSubmit(form);
        }}
      />
    </Stack>
  );
};

export default memo(Form);
