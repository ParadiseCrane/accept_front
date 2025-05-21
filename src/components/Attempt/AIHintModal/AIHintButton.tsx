import { IAttempt } from '@custom-types/data/IAttempt';
import { useLocale } from '@hooks/useLocale';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useState } from 'react';
import PlagiarismModal from '../PlagiarismModal/PlagiarismModal';
import { Button } from '@ui/basics';
import AIHintModal from './AIHintModal';

import styles from './aiHint.module.css';
import { sendRequest } from '@requests/request';

const AIHintButton: FC<{
  attempt: IAttempt;
  customStyle?: string;
}> = ({ attempt, customStyle }) => {
  const [opened, setOpened] = useState(false);
  const { locale, lang } = useLocale();
  const [aiHint, setAIHint] = useState('');
  const [loading, setLoading] = useState(false);

  const requestAIHint = useCallback(async () => {
    setLoading(true);
    const response = await sendRequest<{}, string>(
      `attempt-hint/${attempt.spec}`,
      'GET'
    );
    if (!response.error) setAIHint(response.response);
    setLoading(false);
  }, [attempt.spec]);

  const onClick = useCallback(async () => {
    if (!aiHint.length) {
      requestAIHint();
    } else {
      setOpened(true);
    }
  }, [aiHint.length, requestAIHint]);

  const buttonText = loading
    ? locale.attempt.aiHint.generatingHint
    : aiHint.length
      ? locale.attempt.aiHint.openHint
      : locale.attempt.aiHint.requestHint;

  return (
    <>
      <Button
        kind={'simple'}
        variant="outline"
        onClick={onClick}
        size="sm"
        customStyle={customStyle}
        disabled={loading}
      >
        {buttonText}
      </Button>
      <AIHintModal
        opened={opened}
        onClose={() => setOpened(false)}
        aiHint={aiHint}
        spec={attempt.spec}
      />
    </>
  );
};

export default memo(AIHintButton);
