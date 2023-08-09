import { InputWrapperProps } from '@mantine/core';
import { IDropdownContent } from '@custom-types/ui/basics/helper';

export interface MyInputWrapperProps extends InputWrapperProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
}
