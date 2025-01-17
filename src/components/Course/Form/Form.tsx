import { ICourseAdd, ICourseResponse } from '@custom-types/data/ICourse';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Group, Stack } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { Button, CustomEditor } from '@ui/basics';
import ImageSelector from '@ui/ImageSelector';
import { CourseTree } from '@ui/CourseTree';
import { FC, memo, useState } from 'react';

const courseResponse: ICourseResponse = {
  title: 'Название курса',
  description: 'Описание курса',
  kind: 'course',
  image:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Himalayas%2C_Ama_Dablam%2C_Nepal.jpg/640px-Himalayas%2C_Ama_Dablam%2C_Nepal.jpg',
  children: [
    {
      spec: 'spec1',
      kind: 'unit',
      title: 'Модуль 1',
      order: '1',
    },
    {
      spec: 'spec11',
      kind: 'lesson',
      title: 'Урок 1',
      order: '1|1',
    },
    {
      spec: 'spec12',
      kind: 'lesson',
      title: 'Урок 2',
      order: '1|2',
    },
    {
      spec: 'spec13',
      kind: 'lesson',
      title: 'Урок 3',
      order: '1|3',
    },
    {
      spec: 'spec2',
      kind: 'unit',
      title: 'Модуль 2',
      order: '2',
    },
    {
      spec: 'spec21',
      kind: 'lesson',
      title: 'Урок 1',
      order: '2|1',
    },
    {
      spec: 'spec22',
      kind: 'lesson',
      title: 'Урок 2',
      order: '2|2',
    },
    {
      spec: 'spec23',
      kind: 'lesson',
      title: 'Урок 3',
      order: '2|3',
    },
    {
      spec: 'spec3',
      kind: 'unit',
      title: 'Модуль 3',
      order: '3',
    },
    {
      spec: 'spec31',
      kind: 'lesson',
      title: 'Урок 1',
      order: '3|1',
    },
    {
      spec: 'spec32',
      kind: 'lesson',
      title: 'Урок 2',
      order: '3|2',
    },
    {
      spec: 'spec33',
      kind: 'lesson',
      title: 'Урок 3',
      order: '3|3',
    },
    {
      spec: 'spec4',
      kind: 'unit',
      title: 'Модуль 4',
      order: '4',
    },
    {
      spec: 'spec41',
      kind: 'lesson',
      title: 'Урок 1',
      order: '4|1',
    },
    {
      spec: 'spec42',
      kind: 'lesson',
      title: 'Урок 2',
      order: '4|2',
    },
    {
      spec: 'spec43',
      kind: 'lesson',
      title: 'Урок 3',
      order: '4|3',
    },
  ],
};

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
          title_props={{ ...form.getInputProps('title') }}
          initial_units={form.values.children}
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
