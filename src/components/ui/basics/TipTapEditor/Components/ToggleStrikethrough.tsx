import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Strikethrough } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const ToggleStrikethrough = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('strike') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleStrike().run();
      }}
      aria-label={locale.tiptap.striketrough}
      title={locale.tiptap.striketrough}
    >
      <IconWrapper isActive={isActive} IconChild={Strikethrough} />
    </RichTextEditor.Control>
  );
};
