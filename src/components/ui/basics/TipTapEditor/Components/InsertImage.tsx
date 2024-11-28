import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { PhotoSearch, PhotoUp } from 'tabler-icons-react';
import styles from '../TipTapEditor.module.css';
import { useState } from 'react';
import { ImageUrlModal } from './Modals/ImageUrlModal';
import { IconWrapper } from './IconWrapper';
import { useLocale } from '@hooks/useLocale';

// const loadImageAsFile = ({
//   files,
//   editor,
//   timeout,
// }: {
//   files: FileList | null;
//   editor: Editor;
//   timeout: number;
// }) => {
//   const reader = new FileReader();
//   const { locale } = useLocale();
//   reader.onload = function () {
//     if (typeof reader.result === 'string') {
//       editor
//         ?.chain()
//         .focus()
//         .setImage({
//           src: reader.result,
//           alt: locale.tiptap.imageAltTitle,
//           title: locale.tiptap.imageAltTitle,
//         })
//         .run();
//     }
//     return '';
//   };
//   if (files !== null) {
//     reader.readAsDataURL(files[0]);
//   }
// };

const loadImageAsFile = async ({
  files,
  editor,
  timeout,
  locale,
  width,
}: {
  files: FileList | null;
  editor: Editor;
  timeout: number;
  locale: any;
  width: string;
}) => {
  if (files && files[0]) {
    const formData = new FormData();
    formData.append('upload', files[0]);
    try {
      const response: Response | any = await Promise.race([
        fetch('/api/image', {
          method: 'POST',
          body: formData,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), timeout)
        ),
      ]);
      const json = await response.json();
      const src: string = json['url'];
      editor
        .chain()
        .insertContent(
          `<img src="${src}" alt="${locale.tiptap.imageAltTitle}" style="width: ${width}; height: auto; cursor: pointer;" title="${locale.tiptap.imageAltTitle}" draggable="true">`
        )
        .run();
    } catch (error) {
      const src = 'https://cdn-icons-png.flaticon.com/512/4154/4154393.png';
      editor
        .chain()
        .insertContent(
          `<img src="${src}" alt="${locale.tiptap.imageUploadFail}" style="width: ${width}; height: auto; cursor: pointer;" title="${locale.tiptap.imageUploadFail}" draggable="true">`
        )
        .run();
    }
  }
};

export const InsertImageAsFile = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  return (
    <RichTextEditor.Control
      aria-label={locale.tiptap.imageFile}
      title={locale.tiptap.imageFile}
    >
      <input
        type="file"
        accept={'image/*'}
        className="Input__input"
        onChange={(e) => {
          loadImageAsFile({
            files: e.target.files,
            editor: editor,
            timeout: 4000,
            locale: locale,
            width: '300px',
          });
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
  const { locale } = useLocale();
  return (
    <>
      <RichTextEditor.Control
        onClick={() => {
          setShow(true);
        }}
        aria-label={locale.tiptap.imageURL}
        title={locale.tiptap.imageURL}
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
