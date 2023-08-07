import { FC, memo, useEffect, useRef } from 'react';
import { HoverCard, Button as MantineButton } from '@mantine/core';
import styles from './button.module.css';
import { MyButtonProps } from '@custom-types/ui/basics/button';
import { concatClassNames } from '@utils/concatClassNames';

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
              component={props.href ? 'a' : 'button'}
              {...props}
              classNames={{
                ...props.classNames,
                label: concatClassNames(
                  styles.label,
                  props.classNames?.label
                ),
                root: concatClassNames(
                  styles.root,
                  props.classNames?.root
                ),
              }}
            />
          </div>
        </HoverCard.Target>
      </div>
      {!!dropdownContent && button.current && (
        <HoverCard.Dropdown {...hoverCardDropdownProps}>
          <div className={styles.dropdownContentWrapper}>
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
      )}
    </HoverCard>
  );
};

export default memo(Button);
