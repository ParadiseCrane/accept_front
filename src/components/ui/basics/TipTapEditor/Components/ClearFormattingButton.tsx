import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { ClearFormatting as ClearFormattingIcon } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';

export const ClearFormattingButton = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().unsetAllMarks().run();
      }}
      aria-label="Clear formatting"
      title="Clear formatting"
    >
      <IconWrapper isActive={false} IconChild={ClearFormattingIcon} />
    </RichTextEditor.Control>
  );
};
