import { MathExtension } from '@aarkue/tiptap-math-extension';
import { Document } from '@tiptap/extension-document';
import { History } from '@tiptap/extension-history';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEffect, useState } from 'react';
import styles from './LatexModal.module.css';
import { Editor, useEditor } from '@tiptap/react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { RichTextEditor } from '@mantine/tiptap';
import { insertLatexFunction } from './InsertLatex';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { Checkbox } from '@ui/basics';

export const LatexModal = ({
  isOpened,
  close,
  insertExpression,
}: {
  isOpened: boolean;
  close: any;
  insertExpression: ({
    expression,
    inline,
  }: {
    expression: string;
    inline: boolean;
  }) => void;
}) => {
  const [input, setInput] = useState('');
  const [inline, setInline] = useState(true);

  useEffect(() => {}, [inline]);

  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      MathExtension.configure({ evaluation: false }),
      Document,
      History,
      Paragraph,
      Text,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
    ],
  });

  const onClose = () => {
    editor?.commands.clearContent();
    close();
  };

  const checkboxOnChange = ({
    inline,
    editor,
    input,
  }: {
    inline: boolean;
    editor: Editor;
    input: string;
  }) => {
    setInline(inline);
    insertLatexFunction({ editor: editor, expression: input, inline });
  };

  return (
    <SimpleModal opened={isOpened} close={onClose}>
      <div className={styles.latex_modal_body}>
        <span className={styles.title}>Insert LaTeX expression</span>
        {editor && (
          <div className={styles.input_with_editor}>
            <input
              className={styles.latex_modal_input}
              onChange={(e) => {
                setInput(e.target.value);
                insertLatexFunction({
                  editor: editor,
                  expression: e.target.value,
                  inline: inline,
                });
              }}
            />
            <RichTextEditor editor={editor}>
              <RichTextEditor.Content />
            </RichTextEditor>
          </div>
        )}
        {editor && (
          <div className={styles.checkbox_area}>
            <div className={styles.checkbox_with_label}>
              <label>Inline</label>
              <Checkbox
                checked={inline}
                onChange={() =>
                  checkboxOnChange({
                    editor: editor,
                    inline: true,
                    input: input,
                  })
                }
              />
            </div>
            <div className={styles.checkbox_with_label}>
              <label>Block</label>
              <Checkbox
                checked={!inline}
                onChange={() =>
                  checkboxOnChange({
                    editor: editor,
                    inline: false,
                    input: input,
                  })
                }
              />
            </div>
          </div>
        )}
        <SimpleButtonGroup
          reversePositive={false}
          actionButton={{
            onClick: () => {
              insertExpression({ expression: input, inline: inline });
              onClose();
            },
            label: 'Insert',
          }}
          cancelButton={{ onClick: onClose, label: 'Close' }}
        />
      </div>
    </SimpleModal>
  );
};
