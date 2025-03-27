import { useLocale } from '@hooks/useLocale';
import { RichTextEditor } from '@mantine/tiptap';
import { Editor } from '@tiptap/react';
import { getCookie } from '@utils/cookies';
import { useId, useState } from 'react';
import { PhotoSearch, PhotoUp } from 'tabler-icons-react';

import { imageInsertFunction } from '../TipTapEditor';
import styles from '../TipTapEditor.module.css';
import { IconWrapper } from './IconWrapper';
import { ImageUrlModal } from './Modals/ImageUrlModal';

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
      const access_token = getCookie('access_token');
      const response: Response | any = await Promise.race([
        fetch('/api/image', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${access_token}`,
          } as { [key: string]: string },
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
          imageInsertFunction({
            src: src,
            alt: locale.tiptap.imageAltTitle,
            width: width,
          })
        )
        .run();
    } catch (error) {
      // TODO: Add placeholder
      const src = '';
      editor
        .chain()
        .insertContent(
          imageInsertFunction({
            src: src,
            alt: locale.tiptap.imageUploadFail,
            width: width,
          })
        )
        .run();
    }
  }
};

export const InsertImageAsFile = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  const id = useId();
  return (
    <RichTextEditor.Control
      aria-label={locale.tiptap.imageFile}
      title={locale.tiptap.imageFile}
    >
      <label
        htmlFor={id}
        style={{ display: 'flex', flexDirection: 'column' }}
        className={styles.upload_image}
      >
        <IconWrapper isActive={false} IconChild={PhotoUp} />
      </label>
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
        id={id}
      />
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
