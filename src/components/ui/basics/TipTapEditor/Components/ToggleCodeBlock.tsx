import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { Code } from 'tabler-icons-react';
import { CodeBlockModal } from './Modals/CodeBlockModal';
import { useState } from 'react';
import { IProgrammingLanguage } from '@custom-types/data/tiptap';
import { IconWrapper } from './IconWrapper';

export const ToggleCodeBlock = ({
  editor,
  lowlight,
  languages,
}: {
  editor: Editor;
  lowlight: any;
  languages: IProgrammingLanguage[];
}) => {
  const isActive = editor.isFocused ? editor.isActive('codeBlock') : false;
  const [show, setShow] = useState(false);
  return (
    <>
      <RichTextEditor.Control
        onClick={() => {
          if (!isActive) {
            setShow(true);
          } else {
            editor.commands.toggleCodeBlock();
          }
        }}
        aria-label="Toggle code block"
        title="Toggle code block"
      >
        <IconWrapper isActive={isActive} IconChild={Code} />
      </RichTextEditor.Control>
      <CodeBlockModal
        isOpened={show}
        close={() => setShow(false)}
        lowlight={lowlight}
        languages={languages}
        editor={editor}
      />
    </>
  );
};
