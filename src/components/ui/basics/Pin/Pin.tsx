import { FC, memo } from 'react';
import {
  PinInput as MantinePin,
  PinInputProps as MantinePinProps,
} from '@mantine/core';

const Pin: FC<MantinePinProps> = ({ ...props }) => {
  return <MantinePin {...props} />;
};

export default memo(Pin);
