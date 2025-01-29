import { MyHelperProps } from '@custom-types/ui/basics/helper';
import { HoverCard } from '@mantine/core';
import { Icon } from '@ui/basics';
import { FC, memo } from 'react';
import { Help } from 'tabler-icons-react';

import styles from './helper.module.css';

const Helper: FC<MyHelperProps> = ({
  dropdownContent,
  hoverCardProps,
  hoverCardTargetProps,
  hoverCardDropdownProps,
  customIcon,
  iconColor,
  size,
}) => {
  return (
    <HoverCard
      withArrow
      position="bottom"
      arrowSize={5}
      transitionProps={{ transition: 'scale', duration: 300 }}
      withinPortal
      {...hoverCardProps}
    >
      <HoverCard.Target {...hoverCardTargetProps}>
        <div>
          <Icon size={size || 'xs'}>
            {customIcon || <Help color={iconColor || 'var(--dark4)'} />}
          </Icon>
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown {...hoverCardDropdownProps}>
        <div className={styles.contentWrapper}>
          {typeof dropdownContent == 'string' ? (
            dropdownContent
          ) : dropdownContent instanceof Array ? (
            <div>
              {dropdownContent.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          ) : (
            dropdownContent || ''
          )}
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default memo(Helper);
