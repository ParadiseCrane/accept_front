import { FC, memo, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './timeInfo.module.css';
import { useLocale } from '@hooks/useLocale';
import {
  getLocalDate,
  timerDate,
  timezoneDate,
} from '@utils/datetime';
import { useInterval } from '@mantine/hooks';
import { Button } from '@ui/basics';

import { sendRequest } from '@requests/request';
import { ILocale } from '@custom-types/ui/ILocale';
import CustomTimeModal from '@components/Dashboard/TimeInfo/CustomTimeModal/CustomTimeModal';

interface BaseTimeInfo {
  start: Date;
  end: Date;
  froze?: Date;
  status: 0 | 1 | 2;
  infinite?: boolean;
}

interface TimeInfo extends BaseTimeInfo {
  infinite: boolean;
}

interface ITimeChangeButton {
  value: number;
  multiple: number;
  units: (_: ILocale, __: number) => string;
}

const DECREASE_TIME: ITimeChangeButton[] = [
  {
    value: 1,
    multiple: 3600,
    units: (locale: ILocale, value: number) =>
      locale.timer.hours(value),
  },
  {
    value: 10,
    multiple: 60,
    units: (locale: ILocale, value: number) =>
      locale.timer.minutes(value),
  },
];

const INCREASE_TIME: ITimeChangeButton[] = [
  {
    value: 10,
    multiple: 60,
    units: (locale: ILocale, value: number) =>
      locale.timer.minutes(value),
  },
  {
    value: 1,
    multiple: 3600,
    units: (locale: ILocale, value: number) =>
      locale.timer.hours(value),
  },
];

interface BaseEntity {
  spec: string;
  title: string;
  creator: string;
}

const TimeInfo: FC<{
  type: 'tournament' | 'assignment';
  timeInfo: BaseTimeInfo;
  refetch: () => void;
  entity: BaseEntity;
}> = ({ type, timeInfo, refetch, entity }) => {
  const { locale } = useLocale();

  const [seconds, setSeconds] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [hours, setHours] = useState('00');

  const [days, setDays] = useState(0);
  const [months, setMonths] = useState(0);
  const [years, setYears] = useState(0);

  const [isBrowser, setIsBrowser] = useState(false);

  const tick = useCallback(() => {
    let date = 0;
    switch (timeInfo.status) {
      case 0:
        date =
          timezoneDate(new Date(timeInfo.start)).getTime() -
          new Date().getTime();
        break;
      case 1:
        date =
          timezoneDate(new Date(timeInfo.end)).getTime() -
          new Date().getTime();
        break;
      default:
        date = 0;
    }
    if (timeInfo.status !== 2 && date <= 0) {
      refetch();
    }
    const time = timerDate(Math.max(0, date));
    setSeconds(time.seconds);
    setMinutes(time.minutes);
    setHours(time.hours);
    setDays(time.days);
    setMonths(time.months);
    setYears(time.years);
  }, [refetch, timeInfo]);

  const interval = useInterval(tick, 1000);

  useEffect(() => {
    setIsBrowser(true);
    interval.start();
    return interval.stop;
  }, [tick]); // eslint-disable-line

  const handleTimeButton = useCallback(
    (time: number) => {
      sendRequest<
        { amount: number },
        { end: Date; status: TimeInfo }
      >(`${type}/time/${entity.spec}`, 'POST', {
        amount: time,
      }).then((res) => {
        if (!res.error) {
          refetch();
        }
      });
    },
    [type, entity.spec, refetch]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.infoWrapper}>
        <div className={styles.main}>
          <div className={styles.title}>
            <Link href={`/${type}/${entity.spec}`}>
              {entity.title}
            </Link>
            <div className={styles.status}>
              {locale.assignment.form.status.text}:{' '}
              {locale.assignment.form.status[timeInfo.status]}
            </div>
          </div>
          <div className={styles.starter}>
            {locale.assignment.form.creator}
            {': '}
            {entity.creator}
          </div>
        </div>
        <div className={styles.time}>
          <div className={styles.start}>
            {locale.assignment.form.startTime}
            {': '}
            {isBrowser && getLocalDate(timeInfo.start)}
          </div>
          <div className={styles.end}>
            {timeInfo.infinite ? (
              locale.assignment.form.infinite
            ) : (
              <>
                {locale.assignment.form.endTime}
                {': '}
                {isBrowser && getLocalDate(timeInfo.end)}
              </>
            )}
          </div>
          <br />
          {timeInfo.froze && (
            <div className={styles.froze}>
              {locale.assignment.form.frozeTime}
              {': '}
              {isBrowser && getLocalDate(timeInfo.froze)}
            </div>
          )}
        </div>
      </div>
      <div className={styles.timeWrapper}>
        <div className={styles.before}>
          {timeInfo.status != 2
            ? timeInfo.status == 0
              ? locale.timer.beforeStart
              : locale.timer.beforeEnd
            : locale.timer.finished}
        </div>
        {timeInfo.status !== 2 && (
          <div className={styles.timerWrapper}>
            <div>
              <div className={styles.numberWrapper}>
                <div className={styles.number}>{years}</div>
                <div className={styles.numberTitle}>
                  {locale.timer.years(+years)}
                </div>
              </div>
              <div className={styles.numberWrapper}>
                <div className={styles.number}>{months}</div>
                <div className={styles.numberTitle}>
                  {locale.timer.months(+months)}
                </div>
              </div>
              <div className={styles.numberWrapper}>
                <div className={styles.number}>{days}</div>
                <div className={styles.numberTitle}>
                  {locale.timer.days(+days)}
                </div>
              </div>
            </div>
            <div>
              <div className={styles.numberWrapper}>
                <div className={styles.number}>{hours}</div>
                <div className={styles.numberTitle}>
                  {locale.timer.hours(+hours)}
                </div>
              </div>
              <div className={styles.numberWrapper}>
                <div className={styles.number}>{minutes}</div>
                <div className={styles.numberTitle}>
                  {locale.timer.minutes(+minutes)}
                </div>
              </div>
              <div className={styles.numberWrapper}>
                <div className={styles.number}>{seconds}</div>
                <div className={styles.numberTitle}>
                  {locale.timer.seconds(+seconds)}
                </div>
              </div>
            </div>
          </div>
        )}
        {timeInfo.status !== 0 && (
          <div className={styles.buttonsWrapper}>
            {DECREASE_TIME.map((buttonObject, idx) => (
              <Button
                key={idx}
                targetWrapperStyle={{ width: '100%' }}
                buttonWrapperStyle={{ width: '100%' }}
                style={{
                  borderLeft: idx == 0 ? undefined : 'none',
                  borderRadius: 0,
                  fontSize: 'var(--font-size-s)',
                }}
                fullWidth
                variant="outline"
                onClick={() =>
                  handleTimeButton(
                    -(buttonObject.value * buttonObject.multiple)
                  )
                }
              >
                {`- ${buttonObject.value} ${buttonObject.units(
                  locale,
                  buttonObject.value
                )}`}
              </Button>
            ))}
            <CustomTimeModal
              handleTime={(time: number) => handleTimeButton(time)}
            />
            {INCREASE_TIME.map((buttonObject, idx) => (
              <Button
                key={idx}
                targetWrapperStyle={{ width: '100%' }}
                buttonWrapperStyle={{ width: '100%' }}
                style={{
                  borderLeft: 'none',
                  borderRadius: 0,
                  fontSize: 'var(--font-size-s)',
                }}
                fullWidth
                variant="outline"
                onClick={() =>
                  handleTimeButton(
                    buttonObject.value * buttonObject.multiple
                  )
                }
              >
                {`+ ${buttonObject.value} ${buttonObject.units(
                  locale,
                  buttonObject.value
                )}`}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TimeInfo);
