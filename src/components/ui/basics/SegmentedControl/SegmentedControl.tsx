import {
  SegmentedControl as MantineSegmentedControl,
  SegmentedControlProps,
} from '@mantine/core';
import { FC, memo } from 'react';
import styles from './segmentedControl.module.css';

interface Props extends SegmentedControlProps {}

const SegmentedControl: FC<Props> = (props) => {
  return (
    <MantineSegmentedControl
      classNames={{
        root: styles.root,
        label: styles.label,
      }}
      color="primary"
      {...props}
    />
  );
};

export default memo(SegmentedControl);
