import { useLocale } from '@hooks/useLocale';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { Link as LinkIcon, Unlink as UnlinkIcon } from 'tabler-icons-react';

import { IconWrapper } from './IconWrapper';
import { LinkModal } from './Modals/LinkModal';

export const LinkButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('link') : false;
  const [show, setShow] = useState(false);
  const { locale } = useLocale();

  return (
    <>
      <RichTextEditor.Control
        onClick={() => {
          if (isActive) {
            // console.log('link is', editor.getAttributes('link')['href']);
          } else {
            setShow(true);
          }
        }}
        aria-label={locale.tiptap.setLink}
        title={locale.tiptap.setLink}
      >
        <IconWrapper isActive={isActive} IconChild={LinkIcon} />
      </RichTextEditor.Control>
      {show && (
        <LinkModal
          isOpened={show}
          close={() => setShow(false)}
          editor={editor}
        />
      )}
    </>
  );
};

export const UnlinkButton = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      onClick={() => {
        editor.chain().unsetLink().run();
      }}
      aria-label={locale.tiptap.removeLink}
      title={locale.tiptap.removeLink}
    >
      <IconWrapper isActive={false} IconChild={UnlinkIcon} />
    </RichTextEditor.Control>
  );
};
