import { IPlotData } from '@custom-types/ui/IPlot';
import { FC, memo, useCallback } from 'react';
import styles from './bar.module.css';

const Bar: FC<{
  index: number;
  data: IPlotData;
  width: number;
  height: number;
  length: number;
  padding: number;
  setTooltipLabel: (_: string | undefined) => void;
  hideLabels?: boolean;
}> = ({
  index,
  data,
  width,
  height,
  length,
  padding,
  setTooltipLabel,
  hideLabels = false,
}) => {
  const onEnter = useCallback(
    () => setTooltipLabel(data.amount.toString()),
    [setTooltipLabel, data.amount]
  );
  const onLeave = useCallback(
    () => setTooltipLabel(undefined),
    [setTooltipLabel]
  );
  return (
    <>
      <g
        className={styles.wrapper}
        key={index}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <rect
          className={styles.bar}
          x={20 + index * width + padding * (index + 1)}
          width={width}
          y={155 - height}
          height={2 + height}
          fill={data.color}
        />
        <rect
          x={20 + index * (300 / length)}
          width={300 / length}
          y={155}
          height={10}
          fill="white"
        />
        {!hideLabels && (
          <text
            className={styles.labels}
            x={20 + width * index + padding * (index + 1) + width / 2}
            y={162}
            textAnchor="middle"
          >
            {data.label}
          </text>
        )}
      </g>
    </>
  );
};

export default memo(Bar);
