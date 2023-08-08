import { InputWrapperProps } from '@mantine/core';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import { ReactNode } from 'react';

// TODO: check Omit
export interface MyInputWrapperProps
  extends Omit<InputWrapperProps, 'children'> {
  helperContent?: IDropdownContent;
  shrink?: boolean;
  children?: ReactNode;
}
