import { FC, memo } from 'react';
import { Input as MantineInput } from '@mantine/core';

import inputStyles from '@styles/ui/input.module.css';
import { MyInputWrapperProps } from '@custom-types/ui/basics/inputWrapper';
import { Helper } from '@ui/basics';

const InputWrapper: FC<MyInputWrapperProps> = ({
  helperContent,
  shrink,
  children,
  ...props
}) => {
  return (
    <div
      className={`${inputStyles.wrapper} ${
        shrink ? inputStyles.shrink : ''
      }`}
    >
      <div className={inputStyles.labelWrapper}>
        <div className={inputStyles.label}>
          {props.label}
          {props.required && (
            <div className={inputStyles.labelRequired}>*</div>
          )}
        </div>
        {helperContent && <Helper dropdownContent={helperContent} />}
      </div>
      <MantineInput.Wrapper
        size={shrink ? 'sm' : 'md'}
        classNames={{
          error: props.classNames?.error || inputStyles.error,
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
