import { useLocale } from '@hooks/useLocale';
import { Icon } from '@ui/basics';
import { FC, memo } from 'react';
import { AlertCircle } from 'tabler-icons-react';

import styles from './tests.module.css';

const Tests: FC<{}> = () => {
  const { locale } = useLocale();

  return (
    <div className={styles.wrapper}>
      <Icon size="xs">
        <AlertCircle color={'var(--negative)'} />
      </Icon>

      <div className={styles.alert}>
        {locale.task.tests.separate_page.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
};

export default memo(Tests);
