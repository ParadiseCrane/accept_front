import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { Math } from 'tabler-icons-react';
import { LatexModal } from './LatexModal';

export const insertLatexFunction = ({
  editor,
  expression,
  inline,
}: {
  editor: Editor;
  expression: string;
  inline: boolean;
}) => {
  const characterFilter = expression.replaceAll('$', '');
  const dataDisplay = inline ? 'no' : 'yes';
  editor
    ?.chain()
    .clearContent()
    .insertContent(
      `<span data-latex="${characterFilter}" data-evaluate="no" data-display="${dataDisplay}" data-type="inlineMath">${expression}</span>`
    )
    .run();
};

export const InsertLatexExpression = ({ editor }: { editor: Editor }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <RichTextEditor.Control
        aria-label="Insert LaTeX expression"
        title="Insert LaTeX expression"
      >
        <Math
          stroke={'black'}
          size={'1rem'}
          onClick={() => {
            setShowModal(true);
          }}
        />
      </RichTextEditor.Control>

      <LatexModal
        isOpened={showModal}
        insertExpression={({
          expression,
          inline,
        }: {
          expression: string;
          inline: boolean;
        }) => {
          insertLatexFunction({
            editor: editor,
            expression: expression,
            inline: inline,
          });
        }}
        close={() => {
          setShowModal(false);
        }}
      />
    </>
  );
};
