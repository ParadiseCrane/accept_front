import { FC, memo } from 'react';
import {
  CopyButton as MantineCopyButton,
  CopyButtonProps as MantineCopyButtonProps,
} from '@mantine/core';

const CopyButton: FC<MantineCopyButtonProps> = ({ ...props }) => {
  return <MantineCopyButton {...props} />;
};

export default memo(CopyButton);
