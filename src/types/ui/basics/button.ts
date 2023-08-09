import { CSSProperties, ReactNode } from 'react';
import {
  ButtonProps,
  HoverCardDropdownProps,
  HoverCardProps,
  HoverCardTargetProps,
} from '@mantine/core';

export type MyHoverCardDropdownProps = Omit<
  HoverCardDropdownProps,
  'children'
>;

export type MyButtonProps = ButtonProps &
  React.ComponentPropsWithoutRef<'button'> &
  React.ComponentPropsWithoutRef<'a'> & {
    hoverCardProps?: HoverCardProps;
    hoverCardDropdownProps?: MyHoverCardDropdownProps;
    hoverCardTargetProps?: HoverCardTargetProps;
    dropdownContent?: string | ReactNode | string[];
    targetWrapperStyle?: CSSProperties;
    targetWrapperClassName?: string;
    buttonWrapperStyle?: CSSProperties;
    kind?: 'positive' | 'negative' | 'header';
    shrink?: boolean;
  };
