import { FC, memo } from 'react';
import inputStyles from '@styles/ui/input.module.css';
import {
  PasswordInput as MantinePasswordInput,
  PasswordInputProps,
} from '@mantine/core';
import { Helper, InputLabel } from '@ui/basics';
import { IDropdownContent } from '@custom-types/ui/basics/helper';

interface Props extends PasswordInputProps {
  helperContent?: IDropdownContent;
}

const PasswordInput: FC<Props> = ({
  helperContent,
  label,
  required,
  ...props
}) => {
  return (
    <div className={inputStyles.wrapper}>
      <InputLabel
        label={label}
        helperContent={helperContent}
        required={required}
      />
      <MantinePasswordInput size="lg" {...props} label={undefined} />
    </div>
  );
};

export default memo(PasswordInput);
