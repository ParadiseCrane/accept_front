"use client";
import { Tooltip, TooltipProps } from "@mantine/core";
import { FC, memo } from "react";
import styles from "./tip.module.css";

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
    <Tooltip {...tipProps}>
      <span
        className={`${centerContent ? styles.center : ""} ${spanStyle ?? ""}`}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export default memo(Tip);
