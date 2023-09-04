import { FC, memo } from 'react';
import {
  CopyButton as MantineCopyButton,
  CopyButtonProps as MantineCopyButtonProps,
} from '@mantine/core';
import Icon from '../Icon/Icon';
import { MyIconProps } from '@custom-types/ui/basics/icon';
import { Check, Copy } from 'tabler-icons-react';

interface Props extends Omit<MantineCopyButtonProps, 'children'> {
  iconProps?: MyIconProps;
}

const CopyIcon: FC<Props> = ({ iconProps, ...props }) => {
  return (
    <MantineCopyButton {...props}>
      {({ copy, copied }) => (
        <Icon {...iconProps} onClick={copy}>
          {copied ? <Check color="var(--positive)" /> : <Copy />}
        </Icon>
      )}
    </MantineCopyButton>
  );
};

export default memo(CopyIcon);
