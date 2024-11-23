import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Strikethrough } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';

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
      <IconWrapper isActive={isActive} IconChild={Strikethrough} />
    </RichTextEditor.Control>
  );
};
