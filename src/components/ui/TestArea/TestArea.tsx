import { TextArea } from '@ui/basics';
import { FC, ReactNode, memo } from 'react';
import { pureCallback } from '@custom-types/ui/atomic';
import { TextAreaProps } from '@custom-types/ui/basics/textArea';

export interface TestAreaProps extends TextAreaProps {
  label: ReactNode;
  minRows?: number;
  maxRows?: number;
  readonly?: boolean;
  validateField?: pureCallback;
}

const TestArea: FC<TestAreaProps> = ({
  label,
  minRows,
  maxRows,
  readonly,
  validateField,
  onChange,
  ...props
}) => {
  return (
    <TextArea
      monospace
      autosize
      label={label}
      minRows={minRows || 2}
      maxRows={maxRows}
      onBlur={() =>
        readonly
          ? undefined
          : !!validateField
          ? validateField()
          : () => {}
      }
      {...props}
      onChange={
        readonly || !onChange
          ? undefined
          : (e) => {
              onChange(e);
            }
      }
    />
  );
};

export default memo(TestArea);
