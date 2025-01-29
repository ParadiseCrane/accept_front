import { useLocale } from '@hooks/useLocale';
import { Editor } from '@tiptap/react';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { useState } from 'react';

import styles from './LinkModal.module.css';

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
  const { locale } = useLocale();

  const onClose = () => {
    setSrc('');
    close();
  };

  return (
    <SimpleModal opened={isOpened} close={onClose}>
      <div className={styles.link_modal_body}>
        <span className={styles.title}>{locale.tiptap.setLink}</span>
        <div className={styles.input}>
          <input
            className={styles.link_modal_input}
            onChange={(e) => {
              setSrc(e.target.value);
            }}
          />
        </div>
        <SimpleButtonGroup
          reversePositive={false}
          actionButton={{
            onClick: () => {
              editor.commands.setLink({ href: src });
              onClose();
            },
            label: locale.tiptap.setLink,
          }}
          cancelButton={{ onClick: onClose, label: locale.tiptap.close }}
        />
      </div>
    </SimpleModal>
  );
};
