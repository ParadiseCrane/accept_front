import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { useState } from 'react';
import { Link as LinkIcon, Unlink as UnlinkIcon } from 'tabler-icons-react';
import { LinkModal } from './Modals/LinkModal';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

export const LinkButton = ({ editor }: { editor: Editor }) => {
  const isActive = editor.isFocused ? editor.isActive('link') : false;
  const [show, setShow] = useState(false);
  const { locale } = useLocale();

  return (
    <>
      <RichTextEditor.Control
        onClick={() => {
          if (editor.isFocused) {
            if (isActive) {
              // console.log('link is', editor.getAttributes('link')['href']);
            } else {
              setShow(true);
            }
          }
        }}
        aria-label={locale.tiptap.setLink}
        title={locale.tiptap.setLink}
      >
        <IconWrapper isActive={isActive} IconChild={LinkIcon} />
      </RichTextEditor.Control>
      {show && editor.isFocused && (
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
        if (editor.isFocused) {
          editor.chain().unsetLink().run();
        }
      }}
      aria-label={locale.tiptap.removeLink}
      title={locale.tiptap.removeLink}
    >
      <IconWrapper isActive={false} IconChild={UnlinkIcon} />
    </RichTextEditor.Control>
  );
};
