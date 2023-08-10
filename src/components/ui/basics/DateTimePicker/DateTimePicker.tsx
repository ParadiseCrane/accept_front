import { FC, Suspense, memo } from 'react';
import { DateTimePickerProps as MantineDateTimePickerProps } from '@mantine/dates';
import dynamic from 'next/dynamic';
import { useLocale } from '@hooks/useLocale';
import Helper from '../Helper/Helper';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import inputStyles from '@styles/ui/input.module.css';

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
        <div className={inputStyles.labelWrapper}>
          <div className={inputStyles.label}>
            {label}
            {required && (
              <div className={inputStyles.labelRequired}>*</div>
            )}
          </div>
          {helperContent && (
            <Helper dropdownContent={helperContent} />
          )}
        </div>
        <Suspense>
          <DynamicMantineDateTimePicker
            withSeconds={!withoutSeconds}
            locale={lang}
            size="lg"
            {...props}
            label={undefined}
          />
        </Suspense>
      </div>
    </>
  );
};

export default memo(DateTimePicker);
