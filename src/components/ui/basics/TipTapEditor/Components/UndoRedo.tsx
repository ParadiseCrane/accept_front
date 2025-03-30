import { useLocale } from '@hooks/useLocale';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { ArrowBackUp, ArrowForwardUp, Eraser } from 'tabler-icons-react';

import { IconWrapper } from './IconWrapper';

export const UndoButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.can().undo() : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.commands.undo();
      }}
      aria-label={locale.tiptap.undo}
      title={locale.tiptap.undo}
    >
      <IconWrapper isActive={isActive} IconChild={ArrowBackUp} />
    </RichTextEditor.Control>
  );
};

export const RedoButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.can().redo() : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.commands.redo();
      }}
      aria-label={locale.tiptap.redo}
      title={locale.tiptap.redo}
    >
      <IconWrapper isActive={isActive} IconChild={ArrowForwardUp} />
    </RichTextEditor.Control>
  );
};
