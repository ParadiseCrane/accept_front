import { TextAreaProps } from '@custom-types/ui/basics/textArea';
import { Textarea as MantineTextarea } from '@mantine/core';
import inputStyles from '@styles/ui/input.module.css';
import { InputLabel } from '@ui/basics';
import { FC, memo } from 'react';

import styles from './textArea.module.css';

const TextArea: FC<TextAreaProps> = ({
  helperContent,
  shrink,
  label,
  required,
  monospace,
  inputRef,
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
      <MantineTextarea
        size={shrink ? 'md' : 'lg'}
        ref={inputRef}
        {...props}
        classNames={{
          ...props.classNames,
          // TODO: fix types
          input:
            // @ts-ignore
            props?.classNames?.input +
            (monospace ? ' ' + styles.monospace : ''),
        }}
        label={undefined}
      />
    </div>
  );
};

export default memo(TextArea);
