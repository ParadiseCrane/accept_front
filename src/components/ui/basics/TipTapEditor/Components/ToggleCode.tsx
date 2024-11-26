import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Code } from 'tabler-icons-react';

export const ToggleCode = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('code') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleCode().run();
      }}
      aria-label="Toggle code"
      title="Toggle code"
    >
      <Code style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
