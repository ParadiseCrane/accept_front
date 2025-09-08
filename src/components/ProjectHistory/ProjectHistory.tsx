import { projectHistory } from "@constants/History";
import { Timeline } from "@ui/basics";
import { FC, ReactNode, memo, useMemo } from "react";
import {
  IconAppWindow,
  IconArrowUpRightCircle,
  IconBug,
  IconCheese,
  IconCodePlus,
} from "@tabler/icons-react";

import styles from "./projectHistory.module.css";

const iconSize = 30;

const colors = ["", "old-accept.0", "blue"];

const typeBullets: { [key: string]: ReactNode } = {
  new: <IconCodePlus size={iconSize} />,
  bugfix: <IconBug size={iconSize} />,

  update: <IconArrowUpRightCircle size={iconSize} />,

  style: <IconAppWindow size={iconSize} />,

  soon: <IconCheese size={iconSize} />,
};

const ProjectHistory: FC<{}> = () => {
  const history = useMemo(() => projectHistory.slice().reverse(), []);

  return (
    <Timeline
      color="dark"
      bulletSize={45}
      lineWidth={8}
      classNames={{
        itemBody: styles.itemBody,
        itemTitle: styles.itemTitle,
        itemContent: styles.itemContent,
        itemBullet: styles.itemBullet,
      }}
      active={history.length}
      items={history.map((item, index) => ({
        ...item,
        lineVariant: history[index].type == "soon" ? "dotted" : "solid",
        bullet: typeBullets[item.type],
        color:
          history[index].type == "soon" ? "future.0" : colors[item.version],
      }))}
    />
  );
};

export default memo(ProjectHistory);
