import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { ClearFormatting as ClearFormattingIcon } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const ClearFormattingButton = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().unsetAllMarks().run();
      }}
      aria-label={locale.tiptap.clearFormatting}
      title={locale.tiptap.clearFormatting}
    >
      <IconWrapper isActive={false} IconChild={ClearFormattingIcon} />
    </RichTextEditor.Control>
  );
};
