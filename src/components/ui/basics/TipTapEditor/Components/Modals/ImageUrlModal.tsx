'use client';
import { useLocale } from '@hooks/useLocale';
import { Editor } from '@tiptap/react';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { useCallback, useState } from 'react';

import { imageInsertFunction } from '../../TipTapEditor';
import styles from './ImageUrlModal.module.css';
import { Modal, TextInput } from '@ui/basics';

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

  const onClose = useCallback(() => {
    setSrc('');
    close();
  }, [setSrc, close]);

  return (
    <Modal opened={isOpened} onClose={onClose} withCloseButton={false}>
      <div className={styles.image_url_modal_body}>
        <TextInput
          label={locale.tiptap.imageURL}
          onChange={(e) => {
            setSrc(e.target.value);
          }}
        />
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
    </Modal>
  );
};
