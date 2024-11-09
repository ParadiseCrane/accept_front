import { Tooltip, TooltipProps } from '@mantine/core';
import { FC, memo } from 'react';

const Tip: FC<TooltipProps> = ({ children, ...tipProps }) => {
  return (
    <Tooltip
      withArrow
      inline
      arrowSize={7}
      styles={{
        tooltip: {
          backgroundColor: 'white',
          color: 'black',
          outline: '1px solid var(--dark5)',
        },
        arrow: {
          border: '1px solid var(--dark5)',
        },
      }}
      {...tipProps}
    >
      <span>{children}</span>
    </Tooltip>
  );
};

export default memo(Tip);
