"use client";

import { IBaseTreeUnit, ITreeUnit } from "@custom-types/data/ICourse";
import { FC, memo } from "react";

import styles from "./styles.module.css";
import { Title } from "@mantine/core";
import { IconPoint } from "@tabler/icons-react";

interface Props {
  item: ITreeUnit;
  isDirectChild: boolean;
  select: (_: IBaseTreeUnit) => void;
}

const PADDING_LEFT = "30px";

const Component: FC<Props> = ({ item, select, isDirectChild }) => {
  const onClick = () => select(item);
  const isUnit = item.kind === "unit";

  return (
    <div className={styles.itemWrapper}>
      <div
        className={styles.content}
        onClick={onClick}
        style={{ paddingLeft: `calc(${item.depth} * ${PADDING_LEFT})` }}
      >
        {isDirectChild || <IconPoint size={16} />}
        {isUnit ? (
          <Title order={3} className={styles.unit}>
            {item.title}
          </Title>
        ) : (
          <Title order={4} className={styles.lesson}>
            {item.title}
          </Title>
        )}
      </div>
    </div>
  );
};

export const ContentsItem = memo(Component);
