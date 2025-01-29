import { useLocale } from '@hooks/useLocale';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { List, ListNumbers } from 'tabler-icons-react';

import { IconWrapper } from './IconWrapper';

export const ToggleBulletList = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('bulletList') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleBulletList().run();
      }}
      aria-label={locale.tiptap.bulletList}
      title={locale.tiptap.bulletList}
    >
      <IconWrapper isActive={isActive} IconChild={List} />
    </RichTextEditor.Control>
  );
};

export const ToggleOrderedList = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('orderedList') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleOrderedList().run();
      }}
      aria-label={locale.tiptap.orderedList}
      title={locale.tiptap.orderedList}
    >
      <IconWrapper isActive={isActive} IconChild={ListNumbers} />
    </RichTextEditor.Control>
  );
};
