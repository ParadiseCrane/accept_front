import { IPlotData } from '@custom-types/ui/IPlot';
import { FC, memo, useMemo, useState } from 'react';
import PlotTooltip from '../PlotTooltip/PlotTooltip';
import Bar from './Bar/Bar';
import styles from './barPlot.module.css';
import { ColorSwatch } from '@ui/basics';

const PADDING = 0.1; // percent
const ROW_LINES = 10;

const BarPlot: FC<{
  title?: string;
  data: IPlotData[];
  hideLabels?: boolean;
}> = ({ title, data, hideLabels }) => {
  const [toolTipLabel, setToolTipLabel] = useState<
    string | undefined
  >(undefined);

  const padding = (300 / (data.length + 1)) * PADDING;
  const width = (300 - padding * (data.length + 1)) / data.length;

  const upperBound = useMemo(
    () =>
      Math.round(
        Math.max(...data.map((item) => item.amount)) / ROW_LINES +
          0.75
      ) * ROW_LINES,
    [data]
  );

  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.title}>{title}</div>}
      <PlotTooltip label={toolTipLabel} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 330 166" //0 0 330 166
      >
        <g>
          {new Array(ROW_LINES).fill(0).map((_, index) => (
            <line
              key={index}
              x1="20"
              x2="320"
              y1={index * (150 / ROW_LINES)}
              y2={index * (150 / ROW_LINES)}
              stroke="black"
              strokeWidth={0.2}
              opacity="0.2"
            />
          ))}
        </g>
        <g>
          <line
            x1="20"
            x2="20"
            y1={0}
            y2={155}
            stroke="black"
            strokeWidth={0.2}
            opacity="0.2"
          />
          <line
            x1="320"
            x2="320"
            y1={0}
            y2={155}
            stroke="black"
            strokeWidth={0.2}
            opacity="0.2"
          />
          {new Array(ROW_LINES + 1).fill(0).map((_, index) => (
            <text
              key={index}
              className={styles.labels}
              x={15}
              y={index * (155 / ROW_LINES)}
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
            height={155 * (item.amount / upperBound)}
            length={data.length}
            padding={padding}
            setTooltipLabel={setToolTipLabel}
            hideLabels={hideLabels}
          />
        ))}
      </svg>
      {hideLabels && (
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
