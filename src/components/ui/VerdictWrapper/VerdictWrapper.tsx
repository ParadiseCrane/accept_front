import { IAttemptStatus, IVerdict } from '@custom-types/data/atomic';
import { useLocale } from '@hooks/useLocale';
import { Tip } from '@ui/basics';
import { FC, memo, useMemo } from 'react';

import styles from './verdictWrapper.module.css';

const VerdictWrapper: FC<{
  status?: IAttemptStatus;
  verdict?: IVerdict;
  test?: number;
  full?: boolean;
}> = ({ status, verdict, test, full }) => {
  const { locale } = useLocale();

  const verdictColor = useMemo(
    () =>
      !verdict
        ? 'black'
        : status && status.spec !== 2
          ? status.spec == 3
            ? 'var(--accent)'
            : 'black'
          : verdict?.spec == 0
            ? 'var(--positive)'
            : 'var(--negative)',
    [status, verdict]
  );

  const verdictShortText = useMemo(() => verdict?.shortText || '-', [verdict]);

  const verdictTestString = useMemo(
    () => (test !== undefined ? ` #${test + 1}` : ''),
    [test]
  );

  const isVerdictEmpty = useMemo(() => !verdict, [verdict]);

  return (
    <div
      style={{
        color: verdictColor,
      }}
      className={
        styles.wrapper +
        ' ' +
        (isVerdictEmpty || full ? styles.emptyVerdict : '')
      }
    >
      {full ? (
        <Tip
          label={
            <span style={{ color: verdictColor }}>
              {`${verdict?.fullText}${verdictTestString}`}
            </span>
          }
          openDelay={200}
          position="bottom"
          disabled={isVerdictEmpty}
        >
          {status && status.spec !== 2
            ? locale.attempt.statuses[status.spec]
            : `${verdict?.fullText}${verdictTestString}`}
        </Tip>
      ) : (
        <Tip
          label={
            <span style={{ color: verdictColor }}>
              {`${verdict?.fullText}${verdictTestString}`}
            </span>
          }
          openDelay={200}
          position="bottom"
          disabled={isVerdictEmpty}
        >
          {status && status.spec !== 2
            ? locale.attempt.statuses[status.spec]
            : `${verdictShortText}${verdictTestString}`}
        </Tip>
      )}
    </div>
  );
};

export default memo(VerdictWrapper);
