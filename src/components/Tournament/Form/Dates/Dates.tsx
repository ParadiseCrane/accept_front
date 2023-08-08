import { FC, memo, useCallback } from 'react';
import styles from './dates.module.css';
import {
  DatePicker,
  InputWrapper,
  Overlay,
  RangeCalendar,
  TimeInput,
} from '@ui/basics';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType } from '@mantine/form';

const Dates: FC<{ form: UseFormReturnType<any> }> = ({ form }) => {
  const { locale } = useLocale();
  const setStart = useCallback(
    (start: Date | null) => form.setFieldValue('startDate', start),
    [form]
  );
  const setEnd = useCallback(
    (end: Date | null) => form.setFieldValue('endDate', end),
    [form]
  );

  return (
    <>
      <InputWrapper {...form.getInputProps('dates')}>
        <div
          className={styles.dateTimeInput}
          style={{ position: 'relative' }}
        >
          {form.values.infinite && <Overlay />}
          <RangeCalendar
            start={form.values.startDate}
            // TODO
            // initialMonth={form.values.startDate}
            setStart={setStart}
            end={form.values.endDate}
            setEnd={setEnd}
            allowSingleDateInRange
            inputWrapperProps={{
              ...form.getInputProps('startDate'),
              onBlur: () => {
                form.validateField('startDate');
                form.validateField('endDate');
                form.validateField('dates');
                form.validateField('frozeDate');
              },
              label: locale.tournament.form.calendar,
            }}
          />
          <div className={styles.timeInputs}>
            <TimeInput
              label={locale.tournament.form.startTime}
              {...form.getInputProps('startTime')}
              onBlur={() => {
                form.validateField('startTime');
                form.validateField('dates');
                form.validateField('frozeDate');
              }}
            />
            <TimeInput
              label={locale.tournament.form.endTime}
              {...form.getInputProps('endTime')}
              onBlur={() => {
                form.validateField('endTime');
                form.validateField('dates');
                form.validateField('frozeDate');
              }}
            />
          </div>
        </div>
      </InputWrapper>

      <InputWrapper {...form.getInputProps('frozeDate')}>
        <div className={styles.freezeTable}>
          <DatePicker
            label={locale.tournament.form.freezeTableDate}
            minDate={form.values.startDate}
            maxDate={form.values.endDate}
            {...form.getInputProps('frozeResultsDate')}
          />
          <TimeInput
            label={locale.tournament.form.freezeTableTime}
            {...form.getInputProps('frozeResultsTime')}
            onBlur={() => {
              form.validateField('frozeResultsDate');
              form.validateField('frozeDate');
            }}
          />
        </div>
      </InputWrapper>
    </>
  );
};

export default memo(Dates);
