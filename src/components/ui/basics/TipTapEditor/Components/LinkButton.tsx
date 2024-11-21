import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { Link as LinkIcon, Unlink as UnlinkIcon } from 'tabler-icons-react';
import { LinkModal } from './LinkModal';

export const LinkButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('link') : false;
  const [show, setShow] = useState(false);

  return (
    <div>
      <RichTextEditor.Control
        onClick={() => {
          if (isActive) {
            // console.log('link is', editor.getAttributes('link')['href']);
          } else {
            setShow(true);
          }
        }}
        aria-label="Set link"
        title="Set link"
      >
        <LinkIcon style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
      </RichTextEditor.Control>
      {show && (
        <LinkModal
          isOpened={show}
          close={() => setShow(false)}
          editor={editor}
        />
      )}
    </div>
  );
};

export const UnlinkButton = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().unsetLink().run();
      }}
      aria-label="Remove link"
      title="Remove link"
    >
      <UnlinkIcon size={'1rem'} />
    </RichTextEditor.Control>
  );
};
