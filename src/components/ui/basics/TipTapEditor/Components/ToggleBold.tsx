import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Bold } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const ToggleBold = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('bold') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleMark('bold').run();
      }}
      aria-label={locale.tiptap.bold}
      title={locale.tiptap.bold}
    >
      <IconWrapper isActive={isActive} IconChild={Bold} />
    </RichTextEditor.Control>
  );
};
