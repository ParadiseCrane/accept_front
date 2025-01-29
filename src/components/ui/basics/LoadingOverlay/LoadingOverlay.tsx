import {
  LoadingOverlayProps,
  LoadingOverlay as MantineLoadingOverlay,
} from '@mantine/core';
import { FC, memo } from 'react';

const LoadingOverlay: FC<LoadingOverlayProps> = (props) => {
  return <MantineLoadingOverlay zIndex={100} {...props} />;
};

export default memo(LoadingOverlay);
