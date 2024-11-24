import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Subscript, Superscript } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const ToggleSubscript = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('subscript') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().unsetSuperscript().toggleSubscript().run();
      }}
      aria-label={locale.tiptap.subscript}
      title={locale.tiptap.subscript}
    >
      <IconWrapper isActive={isActive} IconChild={Subscript} />
    </RichTextEditor.Control>
  );
};

export const ToggleSuperscript = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('superscript') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().unsetSubscript().toggleSuperscript().run();
      }}
      aria-label={locale.tiptap.superscript}
      title={locale.tiptap.superscript}
    >
      <IconWrapper isActive={isActive} IconChild={Superscript} />
    </RichTextEditor.Control>
  );
};
