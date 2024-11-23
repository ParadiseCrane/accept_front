import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { PhotoSearch, PhotoUp } from 'tabler-icons-react';
import styles from '../TipTapEditor.module.css';
import { useState } from 'react';
import { ImageUrlModal } from './Modals/ImageUrlModal';
import { IconWrapper } from './IconWrapper';

const loadImageAsFile = ({
  files,
  editor,
}: {
  files: FileList | null;
  editor: Editor;
}) => {
  const reader = new FileReader();
  reader.onload = function () {
    if (typeof reader.result === 'string') {
      // return reader.result;
      editor?.chain().focus().setImage({ src: reader.result }).run();
    }
    return '';
  };
  if (files !== null) {
    reader.readAsDataURL(files[0]);
  }
};

export const InsertImageAsFile = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control aria-label="Upload image" title="Upload image">
      <input
        type="file"
        accept={'image/*'}
        className="Input__input"
        onChange={(e) =>
          loadImageAsFile({ files: e.target.files, editor: editor })
        }
        style={{ display: 'none' }}
        id="upload-image-as-file"
      />
      <label
        htmlFor="upload-image-as-file"
        style={{ display: 'flex', flexDirection: 'column' }}
        className={styles.upload_image}
      >
        <IconWrapper isActive={false} IconChild={PhotoUp} />
      </label>
    </RichTextEditor.Control>
  );
};

export const InsertImageAsUrl = ({ editor }: { editor: Editor }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <RichTextEditor.Control
        onClick={() => {
          setShow(true);
        }}
        aria-label="Upload image from URL"
        title="Upload image from URL"
      >
        <IconWrapper isActive={false} IconChild={PhotoSearch} />
      </RichTextEditor.Control>
      {show && (
        <ImageUrlModal
          isOpened={show}
          close={() => setShow(false)}
          editor={editor}
        />
      )}
    </>
  );
};
