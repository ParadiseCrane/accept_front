import { FC, ReactNode, memo } from 'react';
import {
  PinInput as MantinePin,
  PinInputProps as MantinePinProps,
} from '@mantine/core';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import InputWrapper from '../InputWrapper/InputWrapper';
import { PIN_LENGTH } from '@constants/TournamentSecurity';
import styles from './pin.module.css';
import { concatClassNames } from '@utils/concatClassNames';

interface Props extends MantinePinProps {
  label?: ReactNode;
  helperContent?: IDropdownContent;
  shrink?: boolean;
  rightSection: ReactNode;
  classNames?: any;
}

const Pin: FC<Props> = ({ rightSection, classNames, ...props }) => {
  // TODO: check type
  return (
    // @ts-expect-error
    <InputWrapper {...props}>
      <div
        className={concatClassNames(styles.inputWrapper, classNames?.wrapper)}
      >
        <MantinePin length={PIN_LENGTH} size={'xl'} {...props} />
        {rightSection}
      </div>
    </InputWrapper>
  );
};

export default memo(Pin);
