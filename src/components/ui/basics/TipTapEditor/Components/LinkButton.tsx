import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { Link as LinkIcon, Unlink as UnlinkIcon } from 'tabler-icons-react';

export const LinkButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('link') : false;
  const [show, setShow] = useState(false);

  return (
    <div>
      <RichTextEditor.Control
        onClick={() => {
          if (show) {
            setShow(false);
          } else {
            if (isActive) {
              console.log('link is', editor.getAttributes('link')['href']);
              setShow(true);
            } else {
              editor
                .chain()
                .setLink({
                  href: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
                })
                .run();
            }
          }
        }}
        aria-label="Set link"
        title="Set link"
      >
        <LinkIcon style={isActive ? { stroke: 'red' } : {}} size={'1rem'} />
      </RichTextEditor.Control>
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
