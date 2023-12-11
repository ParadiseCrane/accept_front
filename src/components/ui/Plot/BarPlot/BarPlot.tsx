import { IPlotData } from '@custom-types/ui/IPlot';
import { FC, ReactNode, memo, useMemo, useState } from 'react';
import PlotTooltip from '../PlotTooltip/PlotTooltip';
import Bar from './Bar/Bar';
import styles from './barPlot.module.css';
import { ColorSwatch } from '@ui/basics';
import { callback } from '@custom-types/ui/atomic';

const PADDING = 0.1; // percent
const ROW_LINES = 10;

const BarPlot: FC<{
  title?: string;
  data: IPlotData[];
  hideLabels?: boolean;
  hideColorSwatch?: boolean;
  hideRowLabels?: boolean;
  aspectRatio?: number;
  hoverLabel?: callback<IPlotData, ReactNode>;
}> = ({
  title,
  data,
  hideLabels,
  hideColorSwatch,
  hideRowLabels,
  aspectRatio = 0.5,
  hoverLabel,
}) => {
  const [toolTipLabel, setToolTipLabel] = useState<
    ReactNode | undefined
  >(undefined);

  const padding = (300 / (data.length + 1)) * PADDING;
  const width = (300 - padding * (data.length + 1)) / data.length;
  const height = 300 * aspectRatio;

  const upperBound = useMemo(
    () =>
      Math.round(
        Math.max(...data.map((item) => item.amount)) / ROW_LINES +
          0.75
      ) * ROW_LINES,
    [data]
  );

  return (
    <div
      className={styles.wrapper}
      style={{ aspectRatio: 330 / (height + 16) }}
    >
      {title && <div className={styles.title}>{title}</div>}
      <PlotTooltip>{toolTipLabel}</PlotTooltip>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 330 ${height + 15}`}
      >
        <g>
          {new Array(ROW_LINES + 1).fill(0).map((_, index) => (
            <line
              key={index}
              x1={hideRowLabels ? '0' : '20'}
              x2="320"
              y1={index * (height / ROW_LINES)}
              y2={index * (height / ROW_LINES)}
              stroke="black"
              strokeWidth={0.2}
              opacity="0.2"
            />
          ))}
        </g>
        <g>
          <line
            x1={hideRowLabels ? '0' : '20'}
            x2={hideRowLabels ? '0' : '20'}
            y1={0}
            y2={height + 5}
            stroke="black"
            strokeWidth={0.2}
            opacity="0.2"
          />
          <line
            x1="320"
            x2="320"
            y1={0}
            y2={height + 5}
            stroke="black"
            strokeWidth={0.2}
            opacity="0.2"
          />
          {!hideRowLabels &&
            new Array(ROW_LINES + 1).fill(0).map((_, index) => (
              <text
                key={index}
                className={styles.labels}
                x={15}
                y={index * ((height + 5) / ROW_LINES)}
                textAnchor="end"
              >
                {Math.round(upperBound / ROW_LINES) *
                  (ROW_LINES - index)}
              </text>
            ))}
        </g>
        {data.map((item, index) => (
          <Bar
            key={index}
            data={item}
            index={index}
            width={width}
            height={(height + 5) * (item.amount / upperBound)}
            length={data.length}
            padding={padding}
            totalHeight={height}
            setTooltipLabel={setToolTipLabel}
            hideLabels={hideLabels}
            hideRowLabels={hideRowLabels}
            hoverLabel={hoverLabel}
          />
        ))}
      </svg>
      {!hideColorSwatch && (
        <div className={styles.legendWrapper}>
          {data.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <ColorSwatch color={item.color} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(BarPlot);
