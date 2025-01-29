import { getColor } from '@constants/Colors';
import { IAttemptInfo } from '@custom-types/data/IProfileInfo';
import { IPlotData } from '@custom-types/ui/IPlot';
import { useLocale } from '@hooks/useLocale';
import { BarPiePlot } from '@ui/Plot';
import DefaultCentralText from '@ui/Plot/PiePlot/DefaultCentralText/DefaultCentralText';
import { FC, memo, useMemo } from 'react';

import styles from './attemptInfo.module.css';

const AttemptInfo: FC<IAttemptInfo> = ({
  total,
  language_distribution,
  language_solved_distribution,
  verdict_distribution,
}) => {
  const { locale } = useLocale();

  const language_data = useMemo(
    () =>
      language_distribution.map(
        (item, index) =>
          ({
            label: item.name,
            amount: item.amount,
            color: getColor(index, 4),
          }) as IPlotData
      ),
    [language_distribution]
  );

  const language_solved_data = useMemo(
    () =>
      language_solved_distribution.map(
        (item, index) =>
          ({
            label: item.name,
            amount: item.amount,
            color: getColor(index, 4),
          }) as IPlotData
      ),
    [language_solved_distribution]
  );

  const verdict_data = useMemo(
    () =>
      verdict_distribution.map(
        (item) =>
          ({
            label: item.name,
            amount: item.amount,
            color: item.name === 'OK' ? '#37B24D' : '#FA5252',
          }) as IPlotData
      ),
    [verdict_distribution]
  );

  return (
    <div className={styles.wrapper}>
      <BarPiePlot
        title={locale.profile.info.attempt.languages}
        data={language_data}
        centralLabel={(centerText: IPlotData) => (
          <div className={styles.langWrapper}>
            <div
              className={styles.langName}
              style={{ color: centerText.color }}
            >
              {centerText.label}
            </div>
            <div className={styles.langAmount}>{centerText.amount}</div>
          </div>
        )}
        defaultText={{
          color: '',
          label: locale.total,
          amount: total,
        }}
        hideLabels
      />
      <BarPiePlot
        title={locale.profile.info.attempt.languages_solved}
        data={language_solved_data}
        centralLabel={(centerText: IPlotData) => (
          <div className={styles.langWrapper}>
            <div
              className={styles.langName}
              style={{ color: centerText.color }}
            >
              {centerText.label}
            </div>
            <div className={styles.langAmount}>{centerText.amount}</div>
          </div>
        )}
        defaultText={{
          color: '',
          label: locale.total,
          amount: total,
        }}
        hideLabels
      />

      <BarPiePlot
        title={locale.profile.info.attempt.verdicts}
        data={verdict_data}
        centralLabel={(props) => <DefaultCentralText {...props} />}
        defaultText={{
          label: locale.total,
          amount: total,
          color: '',
        }}
      />
    </div>
  );
};

export default memo(AttemptInfo);
