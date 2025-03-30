import { MyInputWrapperProps } from '@custom-types/ui/basics/inputWrapper';
import { Input as MantineInput } from '@mantine/core';
import inputStyles from '@styles/ui/input.module.css';
import { InputLabel } from '@ui/basics';
import { FC, memo } from 'react';

const InputWrapper: FC<MyInputWrapperProps> = ({
  helperContent,
  shrink,
  label,
  required,
  children,
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
      <MantineInput.Wrapper
        size={shrink ? 'sm' : 'md'}
        classNames={{
          error: inputStyles.error,
          ...props.classNames,
        }}
        {...props}
        label={undefined}
      >
        {children}
      </MantineInput.Wrapper>
    </div>
  );
};

export default memo(InputWrapper);
