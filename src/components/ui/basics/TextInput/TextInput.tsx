import { FC, memo } from 'react';
import {
  TextInput as MantineInput,
  TextInputProps,
} from '@mantine/core';
import { InputLabel } from '@ui/basics';
import inputStyles from '@styles/ui/input.module.css';
import { IDropdownContent } from '@custom-types/ui/basics/helper';

interface Props extends TextInputProps {
  helperContent?: IDropdownContent;
  inputWrapperProps?: object;
  shrink?: boolean;
}

const TextInput: FC<Props> = ({
  label,
  required,
  helperContent,
  shrink,
  inputWrapperProps,
  ...props
}) => {
  return (
    <div
      className={`${inputStyles.wrapper} ${
        shrink ? inputStyles.shrink : ''
      }`}
      {...inputWrapperProps}
    >
      <InputLabel
        label={label}
        helperContent={helperContent}
        required={required}
      />
      <MantineInput
        size={shrink ? 'sm' : 'md'}
        {...props}
        classNames={{
          error: inputStyles.error,
          ...props.classNames,
        }}
        label={undefined}
      />
    </div>
  );
};

export default memo(TextInput);
