import { Tooltip, TooltipProps } from '@mantine/core';
import { FC, memo } from 'react';
import styles from './tip.module.css';

interface ITipProps extends TooltipProps {
  spanStyle?: string;
  centerContent?: boolean;
}

const Tip: FC<ITipProps> = ({
  children,
  spanStyle,
  centerContent,
  ...tipProps
}) => {
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
      <span
        className={`${centerContent ? styles.center : ''} ${spanStyle ?? ''}`}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export default memo(Tip);
