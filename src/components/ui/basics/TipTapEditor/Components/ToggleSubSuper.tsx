import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Subscript, Superscript } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';

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
      <IconWrapper isActive={isActive} IconChild={Subscript} />
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
      <IconWrapper isActive={isActive} IconChild={Superscript} />
    </RichTextEditor.Control>
  );
};
