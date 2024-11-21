import { useState } from 'react';
import styles from './ImageUrlModal.module.css';
import { Editor } from '@tiptap/react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';

const loadImageFromUrl = ({ src, editor }: { src: string; editor: Editor }) => {
  editor
    .chain()
    .setImage({ src: src, alt: 'Uploaded image', title: 'Uploaded image' })
    .run();
};

export const LinkModal = ({
  isOpened,
  close,
  editor,
}: {
  isOpened: boolean;
  close: any;
  editor: Editor;
}) => {
  const [src, setSrc] = useState('');

  const onClose = () => {
    setSrc('');
    close();
  };

  return (
    <SimpleModal opened={isOpened} close={onClose}>
      <div className={styles.image_url_modal_body}>
        <span className={styles.title}>Insert image by URL</span>
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
              loadImageFromUrl({ editor: editor, src: src });
              onClose();
            },
            label: 'Insert',
          }}
          cancelButton={{ onClick: onClose, label: 'Close' }}
        />
      </div>
    </SimpleModal>
  );
};
