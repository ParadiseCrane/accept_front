import { CSSProperties, ReactNode } from 'react';
import {
  ButtonProps,
  HoverCardDropdownProps,
  HoverCardProps,
  HoverCardTargetProps,
} from '@mantine/core';

export type MyButtonProps = ButtonProps &
  React.ComponentPropsWithoutRef<'button'> &
  React.ComponentPropsWithoutRef<'a'> & {
    hoverCardProps?: HoverCardProps;
    hoverCardDropdownProps?: Omit<HoverCardDropdownProps, 'children'>;
    hoverCardTargetProps?: HoverCardTargetProps;
    dropdownContent?: string | ReactNode | string[];
    targetWrapperStyle?: CSSProperties;
    targetWrapperClassName?: string;
    buttonWrapperStyle?: CSSProperties;
    kind?: 'positive' | 'negative' | 'header';
    shrink?: boolean;
  };
