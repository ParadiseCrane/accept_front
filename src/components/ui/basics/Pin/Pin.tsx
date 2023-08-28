import { FC, ReactNode, memo } from 'react';
import {
  PinInput as MantinePin,
  PinInputProps as MantinePinProps,
} from '@mantine/core';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import InputWrapper from '../InputWrapper/InputWrapper';
import { PIN_LENGTH } from '@constants/TournamentSecurity';

interface Props extends MantinePinProps {
  label: ReactNode;
  helperContent?: IDropdownContent;
  shrink?: boolean;
}

const Pin: FC<Props> = ({ ...props }) => {
  // TODO: check type
  return (
    <InputWrapper {...props}>
      <MantinePin length={PIN_LENGTH} size={'xl'} {...props} />
    </InputWrapper>
  );
};

export default memo(Pin);
