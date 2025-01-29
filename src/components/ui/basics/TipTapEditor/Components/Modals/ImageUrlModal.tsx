import { useLocale } from '@hooks/useLocale';
import { Editor } from '@tiptap/react';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { useState } from 'react';

import { imageInsertFunction } from '../../TipTapEditor';
import styles from './ImageUrlModal.module.css';

const loadImageFromUrl = ({
  src,
  editor,
  locale,
  width,
}: {
  src: string;
  editor: Editor;
  locale: any;
  width: string;
}) => {
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
              if (src.includes('http')) {
                loadImageFromUrl({
                  editor: editor,
                  src: src,
                  locale: locale,
                  width: '300px',
                });
                onClose();
              }
            },
            label: locale.tiptap.insert,
          }}
          cancelButton={{ onClick: onClose, label: locale.tiptap.close }}
        />
      </div>
    </SimpleModal>
  );
};
