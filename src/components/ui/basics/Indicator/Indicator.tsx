import { FC, memo, useMemo } from 'react';
import { IndicatorProps, Indicator as MantineIndicator } from '@mantine/core';
import styles from './indicator.module.css';

const OVERFLOW_COUNT = 99;

const SIZES: {
  [key: string]: { size_px: number; font_size: number };
} = {
  sm: { size_px: 20, font_size: 10 },
  md: { size_px: 28, font_size: 14 },
};

interface CustomIndicatorProps extends Omit<IndicatorProps, 'label'> {
  scale?: keyof typeof SIZES;
  blink?: boolean;
  label?: number;
}

const Indicator: FC<CustomIndicatorProps> = ({
  children,
  label,
  scale = 'md',
  blink,
  ...props
}) => {
  const { size_px, font_size } = SIZES[scale];

  const displayLabel = useMemo(
    () =>
      label
        ? label > OVERFLOW_COUNT
          ? `${OVERFLOW_COUNT}+`
          : label.toString()
        : undefined,
    [label]
  );

  return (
    <MantineIndicator
      size={size_px}
      styles={{
        indicator: {
          backgroundColor: props.color || 'var(--accent)',
          fontSize: `${font_size}px`,
        },
        root: {
          display: 'flex',
        },
      }}
      classNames={{ indicator: blink ? styles.blink : '' }}
      {...props}
      label={displayLabel}
    >
      {children}
    </MantineIndicator>
  );
};

export default memo(Indicator);
