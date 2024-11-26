import { FC, memo, useEffect } from 'react';
import {
  MultiSelect as MantineMultiSelect,
  MultiSelectProps,
} from '@mantine/core';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import dynamic from 'next/dynamic';
import { concatClassNames } from '@utils/concatClassNames';
import inputStyles from '@styles/ui/input.module.css';
import InputLabel from '../InputLabel/InputLabel';

interface Props extends MultiSelectProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
  // TODO: remove any
  classNames?: any;
}

const MultiSelect: FC<Props> = ({
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
      <MantineMultiSelect
        size={shrink ? 'sm' : 'md'}
        clearable={false}
        // label={undefined}
        {...props}
        placeholder={props.placeholder}
        classNames={{
          ...props.classNames,
          error: props.classNames?.error || inputStyles.error,
          value: props.classNames?.value || inputStyles.selectValue,
          input: props.classNames?.input || inputStyles.selectInput,
          root: concatClassNames(props.classNames?.root, inputStyles.root),
        }}
      />
    </div>
  );
};

export default memo(MultiSelect);
