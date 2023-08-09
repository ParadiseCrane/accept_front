import { FC, memo } from 'react';
import { Switch as MantineSwitch, SwitchProps } from '@mantine/core';
import styles from './switch.module.css';
import { Helper } from '@ui/basics';
import inputStyles from '@styles/ui/input.module.css';
import { IDropdownContent } from '@custom-types/ui/basics/helper';

interface Props extends SwitchProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
}

const Switch: FC<Props> = ({ helperContent, shrink, ...props }) => {
  return (
    <div
      className={`${styles.wrapper} ${
        shrink ? inputStyles.shrink : ''
      }`}
    >
      <MantineSwitch
        classNames={{
          input: styles.input,
          root: styles.switchWrapper,
          body: styles.switchBody,
        }}
        size={shrink ? 'sm' : 'md'}
        {...props}
        label={undefined}
      />
      <div className={inputStyles.labelWrapper}>
        <div className={inputStyles.label}>{props.label}</div>
        {helperContent && <Helper dropdownContent={helperContent} />}
      </div>
    </div>
  );
};

export default memo(Switch);
