import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { ArrowForwardUp, ArrowBackUp, Eraser } from 'tabler-icons-react';
import { IconWrapper } from './IconWrapper';

export const UndoButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.can().undo();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.commands.undo();
      }}
      aria-label="Undo"
      title="Undo"
    >
      <IconWrapper isActive={isActive} IconChild={ArrowBackUp} />
    </RichTextEditor.Control>
  );
};

export const RedoButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.can().redo();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.commands.redo();
      }}
      aria-label="Redo"
      title="Redo"
    >
      <IconWrapper isActive={isActive} IconChild={ArrowForwardUp} />
    </RichTextEditor.Control>
  );
};
