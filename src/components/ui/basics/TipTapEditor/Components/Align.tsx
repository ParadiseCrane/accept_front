import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import {
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustified as AlignJustifyIcon,
} from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';

export const AlignLeftButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'left' })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('left').run();
      }}
      aria-label="Align left"
      title="Align left"
    >
      <IconWrapper isActive={isActive} IconChild={AlignLeftIcon} />
    </RichTextEditor.Control>
  );
};

export const AlignCenterButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'center' })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('center').run();
      }}
      aria-label="Align center"
      title="Align center"
    >
      <IconWrapper isActive={isActive} IconChild={AlignCenterIcon} />
    </RichTextEditor.Control>
  );
};

export const AlignRightButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'right' })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('right').run();
      }}
      aria-label="Align right"
      title="Align right"
    >
      <IconWrapper isActive={isActive} IconChild={AlignRightIcon} />
    </RichTextEditor.Control>
  );
};

export const AlignJustifyButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive({ textAlign: 'justify' })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().setTextAlign('justify').run();
      }}
      aria-label="Align justify"
      title="Align justify"
    >
      <IconWrapper isActive={isActive} IconChild={AlignJustifyIcon} />
    </RichTextEditor.Control>
  );
};
