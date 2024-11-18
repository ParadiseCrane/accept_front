import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { PhotoSearch, PhotoUp } from 'tabler-icons-react';
import styles from '../TipTapEditor.module.css';

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

const loadImageFromUrl = ({ src, editor }: { src: string; editor: Editor }) => {
  editor
    .chain()
    .setImage({ src: src, alt: 'Uploaded image', title: 'Uploaded image' })
    .run();
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
        <PhotoUp size={'1rem'} />
      </label>
    </RichTextEditor.Control>
  );
};

export const InsertImageAsUrl = ({ editor }: { editor: Editor }) => {
  return (
    <RichTextEditor.Control
      onClick={() => {
        loadImageFromUrl({
          editor: editor,
          src: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg',
        });
      }}
      aria-label="Upload image from URL"
      title="Upload image from URL"
    >
      <PhotoSearch size={'1rem'} />
    </RichTextEditor.Control>
  );
};
