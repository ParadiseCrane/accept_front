import { STICKY_SIZES } from '@constants/Sizes';
import { useWidth } from '@hooks/useWidth';
import { ActionIcon } from '@mantine/core';
import { FC, memo } from 'react';
import { IStickyAction } from '../Sticky';
import { Tip } from '@ui/basics';
import stickyStyles from '../sticky.module.css';
import Link from 'next/link';

const ActionButton: FC<{
  action: IStickyAction;
  sizeRatio?: number;
}> = ({ action, sizeRatio }) => {
  const { width } = useWidth();
  const size = sizeRatio || 1;
  return (
    <Tip
      label={
        <div className={stickyStyles.description}>{action.description}</div>
      }
      position="left"
      openDelay={500}
    >
      <ActionIcon
        // @ts-expect-error
        component={action.onClick ? 'button' : Link}
        radius={size * 60}
        size={size * STICKY_SIZES[width]}
        variant="filled"
        {...action}
      >
        {action.icon}
      </ActionIcon>
    </Tip>
  );
};

export default memo(ActionButton);
