import { MathExtension } from '@aarkue/tiptap-math-extension';
import { useLocale } from '@hooks/useLocale';
import { RichTextEditor } from '@mantine/tiptap';
import { Document } from '@tiptap/extension-document';
import { History } from '@tiptap/extension-history';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Editor, useEditor } from '@tiptap/react';
import { Checkbox } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { useEffect, useState } from 'react';

import styles from './LatexModal.module.css';

const insertLatexFunction = ({
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
  const { locale } = useLocale();

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
        <span className={styles.title}>{locale.tiptap.latex}</span>
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
              <label>{locale.tiptap.inline}</label>
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
              <label>{locale.tiptap.block}</label>
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
            label: locale.tiptap.insert,
          }}
          cancelButton={{ onClick: onClose, label: locale.tiptap.close }}
        />
      </div>
    </SimpleModal>
  );
};
