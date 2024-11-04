import { FC, memo } from 'react';
import {
  NumberInput as MantineNumberInput,
  NumberInputProps,
} from '@mantine/core';
import { InputLabel } from '@ui/basics';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import inputStyles from '@styles/ui/input.module.css';

interface Props extends NumberInputProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
  // TODO: remove any
  classNames?: any;
}

const NumberInput: FC<Props> = ({
  helperContent,
  shrink,
  label,
  required,
  ...props
}) => {
  return (
    <div
      className={`${inputStyles.wrapper} ${shrink ? inputStyles.shrink : ''}`}
    >
      <InputLabel
        label={label}
        helperContent={helperContent}
        required={required}
      />
      <MantineNumberInput
        size={shrink ? 'sm' : 'md'}
        {...props}
        classNames={{
          error: props.classNames?.error || inputStyles.error,
          ...props.classNames,
        }}
        label={undefined}
      />
    </div>
  );
};

export default memo(NumberInput);
