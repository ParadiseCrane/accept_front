import { ActionIcon, Affix, Transition } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { FC, ReactNode, memo, useState } from 'react';
import ActionButton from './ActionButton/ActionButton';
import styles from './sticky.module.css';
import { DotsVertical, X } from 'tabler-icons-react';
import { pureCallback, setter } from '@custom-types/ui/atomic';
import { STICKY_SIZES } from '@constants/Sizes';
import { useWidth } from '@hooks/useWidth';

export interface IStickyAction {
  icon: ReactNode;
  color: string;
  onClick?: pureCallback;
  href?: string;
  description: string;
  hide?: boolean;
}

const Sticky: FC<{
  actions: IStickyAction[];
  classNames?: any;
  color?: string;
}> = ({ actions, classNames, color }) => {
  const [visible, setVisible] = useState(false);
  const ref = useClickOutside(() => setVisible(false));
  const { width } = useWidth();
  return (
    <Affix ref={ref} zIndex={199} position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-up" mounted={visible}>
        {(transitionStyles) => (
          <div className={styles.wrapper} style={transitionStyles}>
            {actions
              .filter((item) => !item.hide)
              .map((action, index) => (
                <ActionButton key={index} action={action} sizeRatio={0.7} />
              ))}
          </div>
        )}
      </Transition>
      <ActionIcon
        variant="filled"
        radius={60}
        size={STICKY_SIZES[width]}
        className={classNames?.button}
        onClick={() => setVisible((visible) => !visible)}
        style={{ backgroundColor: color || 'var(--secondary)' }}
      >
        {!visible && (
          <DotsVertical
            width={STICKY_SIZES[width] / 3}
            height={STICKY_SIZES[width] / 3}
          />
        )}
        {visible && (
          <X width={STICKY_SIZES[width] / 3} height={STICKY_SIZES[width] / 3} />
        )}
      </ActionIcon>
    </Affix>
  );
};

export default memo(Sticky);
