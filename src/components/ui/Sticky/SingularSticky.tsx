import { ActionIcon, Affix } from '@mantine/core';
import { FC, ReactNode, memo } from 'react';
import { pureCallback } from '@custom-types/ui/atomic';
import { useWidth } from '@hooks/useWidth';
import { STICKY_SIZES } from '@constants/Sizes';
import { Tip } from '@ui/basics';
import styles from './sticky.module.css';
import Link from 'next/link';

type positions = {
  bottom: number;
  right: number;
};

const SingularSticky: FC<{
  icon: ReactNode;
  color?: string;
  onClick?: pureCallback;
  href?: string;
  position?: positions;
  description: string;
  classNames?: any;
}> = ({
  icon,
  position,
  color,
  description,
  classNames,
  ...props
}) => {
  const { width } = useWidth();
  return (
    <>
      <Affix
        position={{
          bottom: position?.bottom || 20,
          right: position?.right || 20,
        }}
        zIndex={199}
      >
        <Tip
          label={
            <div className={styles.description}>{description}</div>
          }
          position="left"
          openDelay={500}
        >
          <ActionIcon
            // @ts-expect-error
            component={props.onClick ? 'button' : Link}
            variant="filled"
            radius={60}
            size={STICKY_SIZES[width]}
            className={classNames?.button}
            style={{ backgroundColor: color || 'var(--positive)' }}
            {...props}
          >
            {icon}
          </ActionIcon>
        </Tip>
      </Affix>
    </>
  );
};

export default memo(SingularSticky);
