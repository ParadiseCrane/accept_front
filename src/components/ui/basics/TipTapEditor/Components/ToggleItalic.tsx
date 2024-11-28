import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Italic } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const ToggleItalic = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('italic') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleItalic().run();
      }}
      aria-label={locale.tiptap.italic}
      title={locale.tiptap.italic}
    >
      <IconWrapper isActive={isActive} IconChild={Italic} />
    </RichTextEditor.Control>
  );
};
