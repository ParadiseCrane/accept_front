import { useLocale } from '@hooks/useLocale';
import { Tip } from '@ui/basics';
import { FC, memo, useCallback, useEffect, useState } from 'react';

import styles from './aiHint.module.css';
import { requestWithNotify } from '@utils/requestWithNotify';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { Collapse } from '@mantine/core';
import useElementSize from '@hooks/useElementSize';
import { IAIHint } from '@custom-types/data/IAttempt';

const AIHintCollapse: FC<{
  opened: boolean;
  hint?: IAIHint;
  spec: string;
}> = ({ hint, opened, spec }) => {
  const { locale, lang } = useLocale();
  const [sending, setSending] = useState(false);
  const [collapseWidth, setCollapseWidth] = useState<number | undefined>(
    undefined
  );
  const selfSize = useElementSize();

  const onClick = useCallback(
    async (helpful: boolean) => {
      if (sending || !hint) return;
      setSending(true);
      const value =
        (hint.is_useful && helpful) || (!hint.is_useful && !helpful)
          ? undefined
          : helpful;
      await requestWithNotify<
        { spec: string; endpoint: string; helpful: boolean | undefined },
        boolean
      >(
        `helpful`,
        'POST',
        locale.notify.attempt.feedback,
        lang,
        (_: boolean) => '',
        {
          spec,
          endpoint: 'attempt-hint',
          helpful: value,
        }
      );
      setSending(false);
    },
    [lang, locale, spec, sending]
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
  }, [selfSize]);

  if (!hint) return null;

  return (
    <Collapse in={opened} w={`${collapseWidth}px`}>
      <div className={styles.body}>
        <span>{hint?.content}</span>
        <div className={styles.icons}>
          <Tip label={locale.attempt.aiHint.helpful}>
            <IconThumbUp
              onClick={() => onClick(true)}
              color={hint.is_useful ? 'red' : 'var(--primary)'}
            />
          </Tip>
          <Tip label={locale.attempt.aiHint.notHelpful}>
            <IconThumbDown
              onClick={() => onClick(false)}
              color={!hint.is_useful ? 'red' : 'var(--primary)'}
            />
          </Tip>
        </div>
      </div>
    </Collapse>
  );
};

export default memo(AIHintCollapse);
