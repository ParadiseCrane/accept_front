import { TextareaProps as MantineTextareaProps } from '@mantine/core';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import { RefObject } from 'react';

export interface TextAreaProps extends MantineTextareaProps {
  helperContent?: IDropdownContent;
  shrink?: boolean;
  monospace?: boolean;
  inputRef?: RefObject<HTMLTextAreaElement>;
}
