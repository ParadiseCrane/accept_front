import { FC, memo, useEffect, useState } from 'react';
import styles from './icon.module.css';
import { ActionIcon } from '@mantine/core';
import { useWidth } from '@hooks/useWidth';
import { IWidth } from '@custom-types/ui/atomic';
import { MyIconProps } from '@custom-types/ui/basics/icon';
import { ICON_SIZES } from '@constants/Sizes';
import Tip from '../Tip/Tip';
import Link from 'next/link';

const Icon: FC<MyIconProps> = ({
  children,
  size,
  tooltipLabel,
  tooltipProps,
  wrapperClassName,
  ...props
}) => {
  const { width } = useWidth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`${styles.wrapper} ${wrapperClassName || ''}`}>
      {mounted && (
        <Tip
          label={tooltipLabel}
          disabled={!!!tooltipLabel}
          {...tooltipProps}
        >
          <ActionIcon
            // @ts-expect-error
            component={props.onClick ? 'button' : Link}
            {...props}
            size={
              size
                ? ICON_SIZES[size][width as IWidth]
                : ICON_SIZES['md'][width as IWidth]
            }
          >
            {children}
          </ActionIcon>
        </Tip>
      )}
    </div>
  );
};

export default memo(Icon);
