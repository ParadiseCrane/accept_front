import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Subscript, Superscript } from 'tabler-icons-react';

export const ToggleSubscript = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('subscript') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().unsetSuperscript().toggleSubscript().run();
      }}
      aria-label="Toggle subscript"
      title="Toggle subscript"
    >
      <Subscript style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};

export const ToggleSuperscript = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('superscript') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().unsetSubscript().toggleSuperscript().run();
      }}
      aria-label="Toggle superscript"
      title="Toggle superscript"
    >
      <Superscript style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
