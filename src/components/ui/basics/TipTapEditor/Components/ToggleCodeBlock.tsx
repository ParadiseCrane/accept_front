import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Code } from 'tabler-icons-react';

export const ToggleCodeBlock = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('codeBlock') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleCodeBlock().run();
      }}
      aria-label="Toggle code block"
      title="Toggle code block"
    >
      <Code style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
