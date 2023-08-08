import 'dayjs/locale/ru';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  DatePickerProps,
  DatePicker as MantineRangeCalendar,
} from '@mantine/dates';
import { setter } from '@custom-types/ui/atomic';
import { InputWrapper } from '@ui/basics';
import { MyInputWrapperProps } from '@custom-types/ui/basics/inputWrapper';
import { useLocale } from '@hooks/useLocale';

interface Props
  extends Omit<
    DatePickerProps,
    'value' | 'onChange' | 'allowSingleDateInRange'
  > {
  start: Date | null;
  end: Date | null;
  setStart: setter<Date | null>;
  setEnd: setter<Date | null>;
  inputWrapperProps: MyInputWrapperProps;
  // TODO: stubs
  allowSingleDateInRange?: boolean;
}

const RangeCalendar: FC<Props> = ({
  start,
  end,
  setStart,
  setEnd,
  inputWrapperProps,
  ...props
}) => {
  const [value, setValue] = useState<[Date | null, Date | null]>([
    start,
    end,
  ]);

  const { lang } = useLocale();

  useEffect(() => {
    setValue([start, end]);
  }, [start, end]);

  const onChange = useCallback(
    (values: [Date | null, Date | null]) => {
      setValue(values);
      if (!!values[0] && !!values[1]) {
        setStart(values[0]);
        setEnd(values[1]);
      }
    },
    [setStart, setEnd]
  );

  return (
    <InputWrapper {...inputWrapperProps}>
      <MantineRangeCalendar
        type="range"
        locale={lang}
        {...props}
        value={value}
        onChange={onChange}
      />
    </InputWrapper>
  );
};

export default memo(RangeCalendar);
