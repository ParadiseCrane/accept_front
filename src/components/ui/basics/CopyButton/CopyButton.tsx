import {
  CopyButton as MantineCopyButton,
  CopyButtonProps as MantineCopyButtonProps,
} from '@mantine/core';
import { FC, memo } from 'react';

const CopyButton: FC<MantineCopyButtonProps> = ({ ...props }) => {
  return <MantineCopyButton {...props} />;
};

export default memo(CopyButton);
