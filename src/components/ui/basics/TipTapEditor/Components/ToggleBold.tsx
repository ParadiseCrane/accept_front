import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Bold } from 'tabler-icons-react';

export const ToggleBold = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('bold') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleMark('bold').run();
      }}
      aria-label="Toggle bold"
      title="Toggle bold"
    >
      <Bold style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
