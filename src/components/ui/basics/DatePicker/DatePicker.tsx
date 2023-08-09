import { FC, memo } from 'react';
import inputStyles from '@styles/ui/input.module.css';
import { Helper } from '@ui/basics';
import {
  DatePickerProps,
  DatePicker as MantineDatePicker,
} from '@mantine/dates';
import { useLocale } from '@hooks/useLocale';
import 'dayjs/locale/ru';
import { IDropdownContent } from '@custom-types/ui/basics/helper';

interface Props extends DatePickerProps {
  helperContent?: IDropdownContent;
  // TODO: stubs
  label?: any;
  required?: boolean;
}

const DatePicker: FC<Props> = ({ helperContent, ...props }) => {
  const { lang } = useLocale();

  return (
    <div className={inputStyles.wrapper}>
      <div className={inputStyles.labelWrapper}>
        <div className={inputStyles.label}>
          {props.label}
          {props.required && (
            <div className={inputStyles.labelRequired}>*</div>
          )}
        </div>
        {helperContent && <Helper dropdownContent={helperContent} />}
      </div>
      <MantineDatePicker size="lg" {...props} locale={lang} />
    </div>
  );
};

export default memo(DatePicker);
