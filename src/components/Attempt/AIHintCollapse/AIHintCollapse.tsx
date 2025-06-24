import { FC, memo, useEffect, useState } from 'react';

import styles from './aiHint.module.css';
import { Collapse } from '@mantine/core';
import useElementSize from '@hooks/useElementSize';

const AIHintCollapse: FC<{
  opened: boolean;
  hint?: string;
  spec: string;
}> = ({ hint, opened, spec }) => {
  const [collapseWidth, setCollapseWidth] = useState<number | undefined>(
    undefined
  );
  const selfSize = useElementSize();

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
        <span>{hint}</span>
      </div>
    </Collapse>
  );
};

export default memo(AIHintCollapse);
