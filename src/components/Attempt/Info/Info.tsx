import { IAttempt } from '@custom-types/data/IAttempt';
import React, { FC, memo, useEffect } from 'react';

import styles from './styles.module.css';
import AIHintCollapse from '../AIHintCollapse/AIHintCollapse';
import { useDisclosure } from '@mantine/hooks';
import { LeftComponent } from './Left';
import { RightComponent } from './Right';
import { useStream } from '@hooks/useStream';

const Info: FC<{ attempt: IAttempt }> = ({ attempt }) => {
  const [opened, { toggle }] = useDisclosure(false);

  const {
    loading,
    streaming,
    data: hint,
    error,
    startStream,
  } = useStream(`/api/attempt-hint/${attempt.spec}`);

  return (
    <div className={styles.infoWrapper} id="attempt_info_section">
      <div className={styles.leftWrapper}>
        <LeftComponent
          attempt={attempt}
          requestAIHint={startStream}
          hintLoading={loading || streaming}
          hint={hint}
          opened={opened}
          toggle={toggle}
        />
        <AIHintCollapse opened={true} hint={hint} spec={attempt.spec} />
      </div>
      <RightComponent attempt={attempt} syncScroll={false} />
    </div>
  );
};

export default memo(Info);
