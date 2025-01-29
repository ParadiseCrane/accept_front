import { Overlay as MantineOverlay, OverlayProps } from '@mantine/core';
import { FC, memo } from 'react';

const Overlay: FC<OverlayProps> = (props) => {
  return <MantineOverlay {...props} opacity={0.6} blur={1.5} color="#fff" />;
};

export default memo(Overlay);
