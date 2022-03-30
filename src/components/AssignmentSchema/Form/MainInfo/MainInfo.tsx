import { useLocale } from '@hooks/useLocale';
import { NumberInput, TextInput } from '@mantine/core';
import { capitalize } from '@utils/capitalize';
import { FC, memo } from 'react';
import styles from './mainInfo.module.css';
import CustomEditor from '@components/CustomEditor/CustomEditor';

const MainInfo: FC<{ form: any }> = ({ form }) => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <TextInput
        classNames={{
          label: styles.label,
        }}
        size="lg"
        label={capitalize(locale.assignmentSchema.form.title)}
        required
        {...form.getInputProps('title')}
      />
      <NumberInput
        classNames={{
          label: styles.label,
        }}
        size="lg"
        label={capitalize(
          locale.assignmentSchema.form.defaultDuration
        )}
        {...form.getInputProps('defaultDuration')}
      />
      <CustomEditor
        classNames={{
          label: styles.label,
        }}
        label={capitalize(locale.tasks.form.description)}
        onChange={(value) => form.setFieldValue('description', value)}
        {...form.getInputProps('description')}
      />
    </div>
  );
};

export default memo(MainInfo);
