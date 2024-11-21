import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import {
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustified as AlignJustifyIcon,
} from 'tabler-icons-react';

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
      <AlignLeftIcon style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
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
      <AlignCenterIcon
        style={isActive ? { stroke: 'red' } : {}}
        size={'1rem'}
      />
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
      <AlignRightIcon style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
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
      <AlignJustifyIcon
        style={isActive ? { stroke: 'red' } : {}}
        size={'1rem'}
      />
    </RichTextEditor.Control>
  );
};
