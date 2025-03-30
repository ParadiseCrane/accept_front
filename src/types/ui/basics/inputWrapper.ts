import { IDropdownContent } from '@custom-types/ui/basics/helper';
import { InputWrapperProps } from '@mantine/core';

export interface MyInputWrapperProps extends InputWrapperProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
}
