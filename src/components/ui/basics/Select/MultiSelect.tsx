import { FC, memo } from 'react';
import { MultiSelectProps } from '@mantine/core';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import dynamic from 'next/dynamic';
import { concatClassNames } from '@utils/concatClassNames';
import inputStyles from '@styles/ui/input.module.css';
import InputLabel from '../InputLabel/InputLabel';

const DynamicMultiSelect = dynamic<MultiSelectProps>(() =>
  import('@mantine/core').then((res) => res.MultiSelect)
);

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
      <DynamicMultiSelect
        size={shrink ? 'sm' : 'md'}
        clearable={false}
        {...props}
        classNames={{
          ...props.classNames,
          error: props.classNames?.error || inputStyles.error,
          value: props.classNames?.value || inputStyles.selectValue,
          input: props.classNames?.input || inputStyles.selectInput,
          root: concatClassNames(props.classNames?.root, inputStyles.root),
        }}
        label={undefined}
      />
    </div>
  );
};

export default memo(MultiSelect);
