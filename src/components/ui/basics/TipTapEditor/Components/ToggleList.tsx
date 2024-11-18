import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { List, ListNumbers } from 'tabler-icons-react';

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
      <List style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
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
      <ListNumbers style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
