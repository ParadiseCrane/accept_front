import { IAttempt } from '@custom-types/data/IAttempt';
import React, { FC, memo, useCallback, useState } from 'react';

import styles from './styles.module.css';
import AIHintCollapse from '../AIHintCollapse/AIHintCollapse';
import { useDisclosure } from '@mantine/hooks';
import { sendRequest } from '@requests/request';
import { LeftComponent } from './Left';
import { RightComponent } from './Right';

const Info: FC<{ attempt: IAttempt }> = ({ attempt }) => {
  const [opened, { toggle }] = useDisclosure(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintText, setHintText] = useState('');

  const requestAIHint = useCallback(async () => {
    setHintLoading(true);
    const response = await sendRequest<{}, string>(
      `attempt-hint/${attempt.spec}`,
      'GET'
    );
    if (!response.error) {
      setHintText(response.response);
      toggle();
    }
    setHintLoading(false);
  }, [attempt.spec, toggle]);

  return (
    <div className={styles.infoWrapper} id="attempt_info_section">
      <div className={styles.leftWrapper}>
        <LeftComponent
          attempt={attempt}
          requestAIHint={requestAIHint}
          hintLoading={hintLoading}
          hintText={hintText}
          opened={opened}
          toggle={toggle}
        />
        <AIHintCollapse
          opened={opened}
          onClose={toggle}
          aiHint={hintText}
          spec={attempt.spec}
        />
      </div>
      <RightComponent attempt={attempt} syncScroll={false} />
    </div>
  );
};

export default memo(Info);
