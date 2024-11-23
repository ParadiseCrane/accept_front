import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { List, ListNumbers } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';

export const ToggleBulletList = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('bulletList') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleBulletList().run();
      }}
      aria-label="Bullet list"
      title="Bullet list"
    >
      <IconWrapper isActive={isActive} IconChild={List} />
    </RichTextEditor.Control>
  );
};

export const ToggleOrderedList = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('orderedList') : false;
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleOrderedList().run();
      }}
      aria-label="Ordered list"
      title="Ordered list"
    >
      <IconWrapper isActive={isActive} IconChild={ListNumbers} />
    </RichTextEditor.Control>
  );
};
