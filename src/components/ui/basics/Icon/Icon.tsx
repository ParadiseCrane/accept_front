import { ICON_SIZES } from '@constants/Sizes';
import { IWidth } from '@custom-types/ui/atomic';
import { MyIconProps } from '@custom-types/ui/basics/icon';
import { useWidth } from '@hooks/useWidth';
import { ActionIcon } from '@mantine/core';
import { FC, memo, useEffect, useState } from 'react';

import Tip from '../Tip/Tip';
import styles from './icon.module.css';

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
        <Tip label={tooltipLabel} disabled={!tooltipLabel} {...tooltipProps}>
          <ActionIcon
            component={props.onClick ? 'button' : 'a'}
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
