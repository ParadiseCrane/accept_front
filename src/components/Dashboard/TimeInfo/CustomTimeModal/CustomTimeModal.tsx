import { FC, memo, useCallback, useMemo, useState } from 'react';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { Button } from '@ui/basics';
import IncrementalInput from './IncrementalInput';
import styles from './customTimeModal.module.css';
import { useLocale } from '@hooks/useLocale';

const CustomTimeModal: FC<{ handleTime: (_: number) => void }> = ({
  handleTime,
}) => {
  const [opened, setOpened] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);

  const { locale } = useLocale();

  const handleSend = useCallback(() => {
    handleTime(60 * (minutes + 60 * (hours + 24 * days)));
    setOpened(false);
  }, [minutes, hours, days, handleTime]);

  return (
    <div>
      <Button
        targetWrapperStyle={{ width: '100%' }}
        buttonWrapperStyle={{ width: '100%' }}
        style={{
          borderLeft: 'none',
          borderRadius: 0,
          fontSize: 'var(--font-size-s)',
        }}
        fullWidth
        onClick={() => setOpened(true)}
        variant="outline"
      >
        {locale.dashboard.assignment.timeInfo.enterManually}
      </Button>
      <SimpleModal
        title={locale.dashboard.assignment.timeInfo.addTimeToEnd}
        opened={opened}
        close={() => setOpened(false)}
        size="sm"
        hideCloseButton
        centered
      >
        <div className={styles.inputsWrapper}>
          <div>
            <IncrementalInput
              title={locale.timer.days(days)}
              initialValue={useMemo(() => days, [])} // eslint-disable-line
              onChange={(days: number) => setDays(days)}
            />

            <IncrementalInput
              title={locale.timer.hours(hours)}
              initialValue={useMemo(() => hours, [])} // eslint-disable-line
              onChange={(hours: number) => setHours(hours)}
            />
            <IncrementalInput
              title={locale.timer.minutes(minutes)}
              initialValue={useMemo(() => minutes, [])} // eslint-disable-line
              onChange={(mins: number) => setMinutes(mins)}
            />
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.button}
            onClick={() => setOpened(false)}
            kind="negative"
            variant="outline"
          >
            {locale.cancel}
          </Button>
          <Button
            className={styles.button}
            onClick={handleSend}
            kind="positive"
            variant="outline"
          >
            {locale.edit}
          </Button>
        </div>
      </SimpleModal>
    </div>
  );
};

export default memo(CustomTimeModal);
