"use client";
import { callback } from "@custom-types/ui/atomic";
import { IPlotData } from "@custom-types/ui/IPlot";
import { FC, ReactNode, memo, useCallback } from "react";

import styles from "./bar.module.css";

const Bar: FC<{
  index: number;
  data: IPlotData;
  width: number;
  height: number;
  length: number;
  padding: number;
  setTooltipLabel: (_: ReactNode | undefined) => void;
  hideLabels?: boolean;
  hideRowLabels?: boolean;
  totalHeight: number;
  hoverLabel?: callback<IPlotData, ReactNode>;
  adaptiveDivider: number;
}> = ({
  index,
  data,
  width,
  height,
  length,
  padding,
  setTooltipLabel,
  hideLabels = false,
  hideRowLabels = false,
  totalHeight,
  hoverLabel = (item) => item.amount,
  adaptiveDivider,
}) => {
  const left_padding = hideRowLabels ? 0 : 20;
  const onEnter = useCallback(
    () => setTooltipLabel(hoverLabel(data)),
    [setTooltipLabel, data, hoverLabel],
  );
  const onLeave = useCallback(
    () => setTooltipLabel(undefined),
    [setTooltipLabel],
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
          x={
            (left_padding + index * width + padding * (index + 1)) /
            adaptiveDivider
          }
          width={width / adaptiveDivider}
          y={totalHeight + 5 - height}
          height={2 + height}
          fill={data.color}
        />
        <rect
          x={(left_padding + index * (300 / length)) / adaptiveDivider}
          width={300 / length / adaptiveDivider}
          y={totalHeight + 5}
          height={10}
          fill="white"
        />
        {!hideLabels && (
          <text
            className={styles.labels}
            x={
              (left_padding +
                width * index +
                padding * (index + 1) +
                width / 2) /
              adaptiveDivider
            }
            y={totalHeight + 12}
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
