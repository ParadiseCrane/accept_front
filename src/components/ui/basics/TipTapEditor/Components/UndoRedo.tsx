import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { ArrowForwardUp, ArrowBackUp, Eraser } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const UndoButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.can().undo() : false;
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        if (editor.isFocused) {
          editor.commands.undo();
        }
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
        if (editor.isFocused) {
          editor.commands.redo();
        }
      }}
      aria-label={locale.tiptap.redo}
      title={locale.tiptap.redo}
    >
      <IconWrapper isActive={isActive} IconChild={ArrowForwardUp} />
    </RichTextEditor.Control>
  );
};
