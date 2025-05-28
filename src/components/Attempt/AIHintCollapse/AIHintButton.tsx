import { IAttempt } from '@custom-types/data/IAttempt';
import { useLocale } from '@hooks/useLocale';
import { FC, memo, useCallback, useState } from 'react';
import { Button } from '@ui/basics';

import { sendRequest } from '@requests/request';
import { useDisclosure } from '@mantine/hooks';

const AIHintButton: FC<{
  attempt: IAttempt;
  customStyle?: string;
  onClick?: () => void;
}> = ({ attempt, customStyle, onClick }) => {
  // const [opened, setOpened] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);
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
  }, [attempt]);

  // const onClick = useCallback(async () => {
  //   if (!aiHint.length) {
  //     requestAIHint();
  //   } else {
  //     toggle();
  //   }
  // }, [aiHint.length, requestAIHint, toggle]);

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
      {/* <AIHintCollapse
        opened={opened}
        onClose={() => toggle()}
        aiHint={aiHint}
        spec={attempt.spec}
      /> */}
    </>
  );
};

export default memo(AIHintButton);
