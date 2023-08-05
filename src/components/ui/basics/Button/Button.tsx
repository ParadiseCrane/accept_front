import { FC, memo, useEffect, useRef } from 'react';
import { HoverCard, Button as MantineButton } from '@mantine/core';
import styles from './button.module.css';
import { MyButtonProps } from '@custom-types/ui/basics/button';

const Button: FC<MyButtonProps> = ({
  hoverCardProps,
  hoverCardDropdownProps,
  hoverCardTargetProps,
  targetWrapperStyle,
  targetWrapperClassName,
  buttonWrapperStyle,
  dropdownContent,
  kind,
  variant,
  shrink,
  ...props
}) => {
  const button = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (button.current) button.current.style.visibility = 'visible';
  }, []);

  return (
    <HoverCard
      withArrow
      position="bottom"
      arrowSize={5}
      transition={'scale'}
      transitionDuration={300}
      {...hoverCardProps}
    >
      <div
        className={targetWrapperClassName}
        style={targetWrapperStyle}
      >
        <HoverCard.Target {...hoverCardTargetProps}>
          <div
            ref={button}
            style={{ ...buttonWrapperStyle, visibility: 'hidden' }}
            className={
              `${styles.buttonWrapper} ${
                shrink ? styles.shrink : ''
              }` +
              ' ' +
              (props.disabled
                ? styles.disabled
                : `${kind && styles[kind]} ${
                    variant && styles[variant]
                  }`)
            }
          >
            <MantineButton
              classNames={{
                label: styles.label,
                root: styles.root,
              }}
              component={props.href ? 'a' : 'button'}
              {...props}
            />
          </div>
        </HoverCard.Target>
      </div>
      {!!dropdownContent && button.current && (
        <HoverCard.Dropdown {...hoverCardDropdownProps}>
          <div className={styles.dropdownContentWrapper}>
            {dropdownContent}
          </div>
        </HoverCard.Dropdown>
      )}
    </HoverCard>
  );
};

export default memo(Button);
