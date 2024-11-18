import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Tex } from 'tabler-icons-react';

const insertLatexFunction = ({
  editor,
  expression,
}: {
  editor: Editor;
  expression: string;
}) => {
  const characterFilter = expression.replaceAll('$', '');
  editor?.commands.insertContent(
    `<span data-latex="${characterFilter}" data-evaluate="no" data-display="no" data-type="inlineMath">${expression}</span>`
  );
};

export const InsertLatexExpression = ({
  editor,
  expression,
}: {
  editor: Editor;
  expression: string;
}) => {
  return (
    <RichTextEditor.Control
      onClick={() =>
        insertLatexFunction({ editor: editor, expression: expression })
      }
      aria-label="Insert LaTeX expression"
      title="Insert LaTeX expression"
    >
      <Tex stroke={'black'} size={'1rem'} />
    </RichTextEditor.Control>
  );
};
