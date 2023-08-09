import { FC, memo } from 'react';
import { DateTimePicker, Switch } from '@ui/basics';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType } from '@mantine/form';

const MainInfo: FC<{ form: UseFormReturnType<any> }> = ({ form }) => {
  const { locale } = useLocale();

  return (
    <>
      <DateTimePicker
        required
        label={locale.assignment.form.startTime}
        {...form.getInputProps('startDate')}
      />
      <DateTimePicker
        required
        label={locale.assignment.form.endTime}
        {...form.getInputProps('endDate')}
      />

      <div>
        <Switch
          label={locale.assignment.form.infinite}
          {...form.getInputProps('infinite', { type: 'checkbox' })}
          onChange={(event) => {
            form.setFieldValue(
              'infinite',
              event.currentTarget.checked
            );
            form.clearErrors();
          }}
        />
      </div>
    </>
  );
};

export default memo(MainInfo);
