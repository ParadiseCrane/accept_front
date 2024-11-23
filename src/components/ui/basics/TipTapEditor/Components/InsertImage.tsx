import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { PhotoSearch, PhotoUp } from 'tabler-icons-react';
import styles from '../TipTapEditor.module.css';
import { FormEvent, useState } from 'react';
import { ImageUrlModal } from './Modals/ImageUrlModal';
import { IconWrapper } from './IconWrapper';

const loadImageAsFile = async ({
  files,
  editor,
}: {
  files: FileList | null;
  editor: Editor;
}) => {
  if (files && files[0]) {
    const formData = new FormData();
    formData.append('upload', files[0]);
    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });
      const json = await response.json();
      const src: string = json['url'];
      editor?.chain().focus().setImage({ src: src }).run();
    } catch (error) {}
  }
};

export const InsertImageAsFile = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control aria-label="Upload image" title="Upload image">
      <input
        type="file"
        accept={'image/*'}
        className="Input__input"
        onChange={(e) => {
          loadImageAsFile({ files: e.target.files, editor: editor });
        }}
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
