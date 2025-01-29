import { IPlotData } from '@custom-types/ui/IPlot';
import { FC, memo, useEffect, useMemo, useState } from 'react';

import Arc from './Arc/Arc';
import styles from './piePlot.module.css';

const INNER_RADIUS = 25;
const OUTER_RADIUS = 50;
const INCREASE_RATIO = 1.1;

const PiePlot: FC<{
  title?: string;
  data: IPlotData[];
  centralLabel: FC<IPlotData>;
  defaultText: IPlotData;
}> = ({ title, data, centralLabel, defaultText }) => {
  const [centerText, setCenterText] = useState<IPlotData | undefined>(
    undefined
  );

  const processedData = useMemo(
    () =>
      data
        .filter((item) => item.amount > 0)
        .sort((a, b) => b.amount - a.amount),
    [data]
  );

  const accumulated = useMemo(
    () =>
      processedData.reduce(
        (prev, item) => [...prev, prev[prev.length - 1] + item.amount],
        [0]
      ),
    [processedData]
  );

  const total = useMemo(
    () => accumulated[accumulated.length - 1],
    [accumulated]
  );

  const sinQuarterPi = +Math.sin(Math.PI / 4).toFixed(5);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.title}>{title}</div>}
      <svg viewBox={`0 0 ${100 * INCREASE_RATIO} ${100 * INCREASE_RATIO}`}>
        <g
          transform={`translate(${50 * INCREASE_RATIO}, ${
            50 * INCREASE_RATIO
          })`}
        >
          {processedData.map((item, index) => (
            <Arc
              key={index}
              label={item.label}
              amount={item.amount}
              color={item.color}
              total={total}
              prev={accumulated[index]}
              inner_radius={INNER_RADIUS}
              outer_radius={OUTER_RADIUS}
              setCenterText={setCenterText}
              increase_ratio={INCREASE_RATIO}
            />
          ))}
          {mounted && (
            <foreignObject
              x={-INNER_RADIUS * sinQuarterPi}
              y={-INNER_RADIUS * sinQuarterPi}
              width={2 * INNER_RADIUS * sinQuarterPi}
              height={2 * INNER_RADIUS * sinQuarterPi}
            >
              {centerText
                ? centralLabel(centerText)
                : centralLabel(defaultText)}
            </foreignObject>
          )}
        </g>
      </svg>
    </div>
  );
};

export default memo(PiePlot);
