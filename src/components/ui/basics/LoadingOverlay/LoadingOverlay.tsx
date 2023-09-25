import { FC, memo } from 'react';
import {
  LoadingOverlayProps,
  LoadingOverlay as MantineLoadingOverlay,
} from '@mantine/core';

const LoadingOverlay: FC<LoadingOverlayProps> = (props) => {
  return <MantineLoadingOverlay zIndex={100} {...props} />;
};

export default memo(LoadingOverlay);
