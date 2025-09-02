'use client';
import { useLocale } from '@hooks/useLocale';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { IconUnderline } from '@tabler/icons-react';

import { IconWrapper } from './IconWrapper';

export const ToggleUnderline = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('underline') : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().toggleUnderline().run();
      }}
      aria-label={locale.tiptap.underline}
      title={locale.tiptap.underline}
    >
      <IconWrapper isActive={isActive} IconChild={IconUnderline} />
    </RichTextEditor.Control>
  );
};
