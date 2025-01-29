import {
  ButtonProps,
  HoverCardDropdownProps,
  HoverCardProps,
  HoverCardTargetProps,
} from '@mantine/core';
import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type MyHoverCardDropdownProps = Omit<HoverCardDropdownProps, 'children'>;

export type MyButtonProps = ButtonProps &
  ComponentPropsWithoutRef<'button'> &
  ComponentPropsWithoutRef<'a'> & {
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
