import { ICourseAdd } from '@custom-types/data/ICourse';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Stack } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { CustomEditor, TextInput } from '@ui/basics';
import UnitSelector from '@ui/UnitSelector';
import { FC, memo } from 'react';

const Form: FC<{
  handleSubmit: callback<UseFormReturnType<any>>;
  initialValues: ICourseAdd;
  buttonLabel: string;
  shouldNotify: boolean;
}> = ({ handleSubmit, initialValues, buttonLabel, shouldNotify }) => {
  const { locale } = useLocale();
  const form = useForm<ICourseAdd>({ initialValues: initialValues });
  return (
    <Stack>
      <TextInput {...form.getInputProps('title')} />
      {/* TODO: Add locale */}
      <CustomEditor
        label={locale.assignmentSchema.form.description}
        form={form}
        name="description"
      />
      {/* <ImageSelector /> */}
      <UnitSelector initial_units={form.values.children} />
    </Stack>
  );
};

export default memo(Form);
