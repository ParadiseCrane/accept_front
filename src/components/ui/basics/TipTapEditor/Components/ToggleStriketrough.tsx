import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Strikethrough } from 'tabler-icons-react';

export const ToggleStrikethrough = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('strike') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleStrike().run();
      }}
      aria-label="Toggle strikethrough"
      title="Toggle strikethrough"
    >
      <Strikethrough style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
