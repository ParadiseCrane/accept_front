import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Underline } from 'tabler-icons-react';

export const ToggleUnderline = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('underline') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleUnderline().run();
      }}
      aria-label="Toggle underline"
      title="Toggle underline"
    >
      <Underline style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
