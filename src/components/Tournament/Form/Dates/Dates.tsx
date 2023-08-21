import { FC, memo } from 'react';
import styles from './dates.module.css';
import { DateTimePicker } from '@ui/basics';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType } from '@mantine/form';

const Dates: FC<{ form: UseFormReturnType<any> }> = ({ form }) => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <DateTimePicker
        label={locale.tournament.form.startDate}
        {...form.getInputProps('start')}
      />
      <DateTimePicker
        label={locale.tournament.form.endDate}
        {...form.getInputProps('end')}
      />

      <DateTimePicker
        label={locale.tournament.form.freezeTableDate}
        minDate={form.values.start}
        maxDate={form.values.end}
        {...form.getInputProps('frozeResults')}
      />
    </div>
  );
};

export default memo(Dates);
