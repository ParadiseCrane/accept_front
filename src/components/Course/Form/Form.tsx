import { ICourseAdd } from '@custom-types/data/ICourse';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Group, Stack } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { CustomEditor } from '@ui/basics';
import ImageSelector from '@ui/ImageSelector';
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
    <Stack m={'xl'} maw={'60%'}>
      <Group grow align="flex-start">
        <UnitSelector
          title_props={{ ...form.getInputProps('title') }}
          initial_units={form.values.children}
        />
        <ImageSelector />
      </Group>
      {/* TODO: Add locale */}
      <CustomEditor
        label={locale.assignmentSchema.form.description}
        form={form}
        name="description"
      />
    </Stack>
  );
};

export default memo(Form);
