import { useLocale } from '@hooks/useLocale';
import { Modal, Tip } from '@ui/basics';
import { FC, memo, useCallback, useEffect, useState } from 'react';

import styles from './aiHint.module.css';
import { requestWithNotify } from '@utils/requestWithNotify';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { Collapse } from '@mantine/core';
import useElementSize from '@hooks/useElementSize';
import { useWindowWidth } from '@hooks/useWindowResize';

const AIHintCollapse: FC<{
  opened: boolean;
  onClose: () => void;
  aiHint: string;
  spec: string;
}> = ({ aiHint, opened, onClose, spec }) => {
  const { locale, lang } = useLocale();
  const [sending, setSending] = useState(false);
  const [collapseWidth, setCollapseWidth] = useState<number | undefined>(
    undefined
  );
  const windowWidth = useWindowWidth();

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
    [lang, locale, spec, sending, onClose]
  );

  const calculateCollapseWidth = () => {
    if (document) {
      const infoSection = document.getElementById('attempt_info_section');
      const rightSection = document.getElementById('attempt_right_section');
      if (infoSection && rightSection) {
        return infoSection.offsetWidth - rightSection.offsetWidth;
      }
    }
  };

  useEffect(() => {
    setCollapseWidth(calculateCollapseWidth());
  }, [windowWidth]);

  return (
    <Collapse in={opened} w={`${collapseWidth}px`}>
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
    </Collapse>
  );
};

export default memo(AIHintCollapse);
