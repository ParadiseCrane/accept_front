import { FC, memo, useEffect, useRef, useState } from 'react';
import { HoverCard, Button as MantineButton } from '@mantine/core';
import styles from './button.module.css';
import { MyButtonProps } from '@custom-types/ui/basics/button';
import { concatClassNames } from '@utils/concatClassNames';
import Link from 'next/link';

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

  const [mounted, setMounted] = useState(false);

  // TODO remove any
  const component: any = props.href ? Link : 'button';
  const propsClassName: any = props.classNames;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <HoverCard
          withArrow
          position="bottom"
          arrowSize={5}
          transitionProps={{ transition: 'scale', duration: 300 }}
          {...hoverCardProps}
        >
          <div className={targetWrapperClassName} style={targetWrapperStyle}>
            <HoverCard.Target {...hoverCardTargetProps}>
              <div
                ref={button}
                style={{ ...buttonWrapperStyle }}
                className={
                  `${styles.buttonWrapper} ${shrink ? styles.shrink : ''}` +
                  ' ' +
                  (props.disabled
                    ? styles.disabled
                    : `${kind && styles[kind]} ${variant && styles[variant]}`)
                }
              >
                <MantineButton
                  component={component}
                  {...props}
                  classNames={{
                    ...props.classNames,
                    label: concatClassNames(
                      styles.label,
                      propsClassName?.label
                    ),
                    root: concatClassNames(styles.root, propsClassName?.root),
                  }}
                />
              </div>
            </HoverCard.Target>
          </div>

          {!!dropdownContent && (
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
      )}
    </>
  );
};

export default memo(Button);
