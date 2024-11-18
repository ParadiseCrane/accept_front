import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Blockquote } from 'tabler-icons-react';

export const ToggleBlockquote = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('blockquote') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleBlockquote().run();
      }}
      aria-label="Toggle blockquote"
      title="Toggle blockquote"
    >
      <Blockquote style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
