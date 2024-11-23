import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Italic } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';

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
      <IconWrapper isActive={isActive} IconChild={Italic} />
    </RichTextEditor.Control>
  );
};
