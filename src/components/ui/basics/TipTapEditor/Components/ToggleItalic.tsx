import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Italic } from 'tabler-icons-react';

export const ToggleItalic = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('italic') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleItalic().run();
      }}
      aria-label="Toggle italic"
      title="Toggle italic"
    >
      <Italic style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
