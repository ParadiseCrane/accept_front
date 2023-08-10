import { FC, memo } from 'react';
import { MultiSelectProps } from '@mantine/core';
import { Helper } from '@ui/basics';
import inputStyles from '@styles/ui/input.module.css';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import dynamic from 'next/dynamic';
import { concatClassNames } from '@utils/concatClassNames';

const DynamicMultiSelect = dynamic<MultiSelectProps>(() =>
  import('@mantine/core').then((res) => res.MultiSelect)
);

interface Props extends MultiSelectProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
}

const MultiSelect: FC<Props> = ({
  helperContent,
  shrink,
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
      <DynamicMultiSelect
        size={shrink ? 'sm' : 'md'}
        clearable={false}
        {...props}
        classNames={{
          ...props.classNames,
          error: props.classNames?.error || inputStyles.error,
          value: props.classNames?.value || inputStyles.selectValue,
          input: props.classNames?.input || inputStyles.selectInput,
          root: concatClassNames(
            props.classNames?.root,
            inputStyles.root
          ),
        }}
        label={undefined}
      />
    </div>
  );
};

export default memo(MultiSelect);
