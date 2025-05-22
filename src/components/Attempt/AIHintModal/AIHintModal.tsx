import { useLocale } from '@hooks/useLocale';
import { Modal, Tip } from '@ui/basics';
import { FC, memo, useCallback, useState } from 'react';

import styles from './aiHint.module.css';
import { requestWithNotify } from '@utils/requestWithNotify';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';

const AIHintModal: FC<{
  opened: boolean;
  onClose: () => void;
  aiHint: string;
  spec: string;
}> = ({ aiHint, onClose, opened, spec }) => {
  const { locale, lang } = useLocale();
  const [sending, setSending] = useState(false);

  const onClick = useCallback(
    async (helpful: boolean) => {
      if (sending) return;
      setSending(true);
      await requestWithNotify<{ helpful: boolean }, boolean>(
        `helpful/attempt-hint/${spec}`,
        'POST',
        locale.notify.attempt.feedback,
        lang,
        (_: boolean) => '',
        {
          helpful: helpful,
        }
      );
      setSending(false);
      onClose();
    },
    [lang, locale, onClose, spec, sending]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={locale.attempt.aiHint.title}
      size={'lg'}
    >
      <div className={styles.body}>
        <span>{aiHint}</span>
        <div className={styles.icons}>
          <Tip label={locale.attempt.aiHint.helpful}>
            <IconThumbUp
              onClick={() => onClick(true)}
              color={'var(--primary)'}
            />
          </Tip>
          <Tip label={locale.attempt.aiHint.notHelpful}>
            <IconThumbDown
              onClick={() => onClick(false)}
              color={'var(--primary)'}
            />
          </Tip>
        </div>
      </div>
    </Modal>
  );
};

export default memo(AIHintModal);
