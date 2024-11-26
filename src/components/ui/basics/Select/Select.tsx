import { FC, memo } from 'react';
import { Select as MantineSelect, SelectProps } from '@mantine/core';
import { InputLabel } from '@ui/basics';
import inputStyles from '@styles/ui/input.module.css';
import { IDropdownContent } from '@custom-types/ui/basics/helper';

interface Props extends SelectProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
  // TODO: remove any
  classNames?: any;
}

const Select: FC<Props> = ({
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
      <MantineSelect
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

export default memo(Select);
