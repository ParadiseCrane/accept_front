import { IAttempt } from '@custom-types/data/IAttempt';
import { useLocale } from '@hooks/useLocale';
import { TextArea } from '@ui/basics';
import { FC, memo } from 'react';

import styles from './textAnswer.module.css';

const TextAnswer: FC<{ attempt: IAttempt }> = ({ attempt }) => {
  const { locale } = useLocale();
  return (
    <div className={styles.itemsWrapper}>
      {attempt.textAnswers.map((answer, index) => (
        <div className={styles.itemWrapper} key={index}>
          <div className={styles.itemTitle}>
            {' '}
            {`${locale.task.answer} #${index + 1}`}
          </div>
          <TextArea
            value={answer}
            onChange={() => {}}
            autosize
            maxRows={10}
            minRows={3}
          />
        </div>
      ))}
    </div>
  );
};

export default memo(TextAnswer);
