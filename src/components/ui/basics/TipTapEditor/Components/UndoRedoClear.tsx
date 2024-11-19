import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { ArrowForwardUp, ArrowBackUp, Eraser } from 'tabler-icons-react';

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
      <ArrowBackUp style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
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
      <ArrowForwardUp style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};

export const ClearButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.can().redo();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.commands.clearContent();
      }}
      aria-label="Clear content"
      title="Clear content"
    >
      <Eraser style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
