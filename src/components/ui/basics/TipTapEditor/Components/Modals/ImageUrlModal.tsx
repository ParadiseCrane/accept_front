import { useState } from 'react';
import styles from './ImageUrlModal.module.css';
import { Editor } from '@tiptap/react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { useLocale } from '@hooks/useLocale';

const loadImageFromUrl = ({
  src,
  editor,
  locale,
}: {
  src: string;
  editor: Editor;
  locale: any;
}) => {
  editor
    .chain()
    .setImage({
      src: src,
      alt: locale.tiptap.imageAltTitle,
      title: locale.tiptap.imageAltTitle,
    })
    .run();
};

export const ImageUrlModal = ({
  isOpened,
  close,
  editor,
}: {
  isOpened: boolean;
  close: any;
  editor: Editor;
}) => {
  const [src, setSrc] = useState('');
  const { locale } = useLocale();

  const onClose = () => {
    setSrc('');
    close();
  };

  return (
    <SimpleModal opened={isOpened} close={onClose}>
      <div className={styles.image_url_modal_body}>
        <span className={styles.title}>{locale.tiptap.imageURL}</span>
        <div className={styles.input}>
          <input
            className={styles.image_url_modal_input}
            onChange={(e) => {
              setSrc(e.target.value);
            }}
          />
        </div>
        <SimpleButtonGroup
          reversePositive={false}
          actionButton={{
            onClick: () => {
              loadImageFromUrl({ editor: editor, src: src, locale: locale });
              onClose();
            },
            label: locale.tiptap.insert,
          }}
          cancelButton={{ onClick: onClose, label: locale.tiptap.close }}
        />
      </div>
    </SimpleModal>
  );
};
