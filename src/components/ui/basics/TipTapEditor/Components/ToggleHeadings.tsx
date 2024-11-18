import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { H1, H2, H3, H4 } from 'tabler-icons-react';

export const ToggleHeading1 = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive('heading', { level: 1 })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleHeading({ level: 1 }).run();
      }}
      aria-label="Toggle H1"
      title="Toggle H1"
    >
      <H1 style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};

export const ToggleHeading2 = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive('heading', { level: 2 })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleHeading({ level: 2 }).run();
      }}
      aria-label="Toggle H2"
      title="Toggle H2"
    >
      <H2 style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};

export const ToggleHeading3 = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive('heading', { level: 3 })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleHeading({ level: 3 }).run();
      }}
      aria-label="Toggle H3"
      title="Toggle H3"
    >
      <H3 style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};

export const ToggleHeading4 = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused
    ? editor.isActive('heading', { level: 4 })
    : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleHeading({ level: 4 }).run();
      }}
      aria-label="Toggle H4"
      title="Toggle H4"
    >
      <H4 style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
