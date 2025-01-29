import { MyTimelineItemProps } from '@custom-types/ui/basics/timeline';
import { Timeline as MantineTimeline, TimelineProps } from '@mantine/core';
import { FC, memo } from 'react';

import styles from './timeline.module.css';

interface Props extends Omit<TimelineProps, 'children'> {
  items: MyTimelineItemProps[];
}

const Timeline: FC<Props> = ({ items, ...props }) => {
  return (
    <MantineTimeline {...props}>
      {items.map((item, index) => (
        <MantineTimeline.Item key={index} {...item} content="">
          {item.content !== '' && (
            <div className={styles.contentWrapper}>{item.content}</div>
          )}
          <div className={styles.dateWrapper}>{item.date}</div>
        </MantineTimeline.Item>
      ))}
    </MantineTimeline>
  );
};

export default memo(Timeline);
