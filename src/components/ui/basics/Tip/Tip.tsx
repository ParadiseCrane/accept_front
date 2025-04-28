import { Tooltip, TooltipProps } from '@mantine/core';
import { FC, memo } from 'react';

interface ITipProps extends TooltipProps {
  spanStyle?: string;
}

const Tip: FC<ITipProps> = ({ children, spanStyle, ...tipProps }) => {
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
      <span className={spanStyle}>{children}</span>
    </Tooltip>
  );
};

export default memo(Tip);
