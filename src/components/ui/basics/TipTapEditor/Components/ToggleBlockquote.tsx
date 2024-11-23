import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Blockquote } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';

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
      <IconWrapper isActive={isActive} IconChild={Blockquote} />
    </RichTextEditor.Control>
  );
};
