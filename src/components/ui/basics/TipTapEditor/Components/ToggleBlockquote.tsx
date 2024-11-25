import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Blockquote } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const ToggleBlockquote = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('blockquote') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        if (editor.isFocused) {
          editor.chain().toggleBlockquote().run();
        }
      }}
      aria-label={locale.tiptap.quote}
      title={locale.tiptap.quote}
    >
      <IconWrapper isActive={isActive} IconChild={Blockquote} />
    </RichTextEditor.Control>
  );
};
