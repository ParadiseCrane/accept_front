import { FC, memo } from 'react';
import { DateTimePickerProps as MantineDateTimePickerProps } from '@mantine/dates';
import dynamic from 'next/dynamic';
import { useLocale } from '@hooks/useLocale';
import Helper from '../Helper/Helper';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import inputStyles from '@styles/ui/input.module.css';
import InputLabel from '../InputLabel/InputLabel';

const DynamicMantineDateTimePicker =
  dynamic<MantineDateTimePickerProps>(
    () => import('@mantine/dates').then((res) => res.DateTimePicker),
    { ssr: false }
  );

interface CustomDateTimePickerProps
  extends Omit<MantineDateTimePickerProps, 'withSeconds'> {
  withoutSeconds?: boolean;
  required?: boolean;
  helperContent?: IDropdownContent;
}

const DateTimePicker: FC<CustomDateTimePickerProps> = ({
  label,
  withoutSeconds,
  required,
  helperContent,
  ...props
}) => {
  const { lang } = useLocale();

  return (
    <>
      <div className={inputStyles.wrapper}>
        <InputLabel
          label={label}
          helperContent={helperContent}
          required={required}
        />
        <DynamicMantineDateTimePicker
          withSeconds={!withoutSeconds}
          locale={lang}
          size="lg"
          {...props}
          label={undefined}
        />
      </div>
    </>
  );
};

export default memo(DateTimePicker);
