import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { useInterval } from '@mantine/hooks';
import { IResponse } from '@requests/request';
import { Icon } from '@ui/basics';
import { timerDate, timezoneDate } from '@utils/datetime';
import {
  infoNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Alarm } from 'tabler-icons-react';

import styles from './timer.module.css';

const RED_TIME_S = 900;

interface BaseTimeInfo {
  start: Date;
  end: Date;
  status: 0 | 1 | 2;
  infinite?: boolean;
}

interface TimeInfo extends BaseTimeInfo {
  infinite: boolean;
}

const Timer: FC<{ url: string }> = ({ url }: { url: string }) => {
  const [showTimer, setShowTimer] = useState(false);
  const { locale } = useLocale();

  const { data, loading, refetch } = useRequest<{}, BaseTimeInfo, TimeInfo>(
    url,
    'GET',
    undefined,
    (data) => ({
      start: data.start,
      end: data.end,
      infinite: data.infinite || false,
      status: data.status,
    })
  );
  const refetchTimer = useInterval(() => refetch(false), 15000);

  const [days, setDays] = useState('01');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const tick = useCallback(() => {
    let date = 0;
    if (!loading && (data?.infinite || data?.status == 2)) refetchTimer.stop();
    if (data && !data.infinite) {
      switch (data.status) {
        case 0:
          date =
            timezoneDate(new Date(data.start)).getTime() - new Date().getTime();
          break;
        case 1:
          date =
            timezoneDate(new Date(data.end)).getTime() - new Date().getTime();
          break;
        default:
          date = 0;
      }

      if (data.status != 2 && date <= 0) {
        refetch(false).then((res: IResponse<BaseTimeInfo>) => {
          if (!res.error) {
            if (res.response.status == 2) {
              const id = newNotification({});
              infoNotification({
                id,
                title: locale.notify.tournament.timer.finished,
                autoClose: 5000,
              });
            } else if (res.response.status == 1 && data.status == 0) {
              const id = newNotification({});
              infoNotification({
                id,
                title: locale.notify.tournament.timer.started,
                autoClose: 5000,
              });
            }
          }
        });
      }
    }
    const time = timerDate(Math.max(0, date));
    setSeconds(time.seconds);
    setMinutes(time.minutes);
    setHours(time.hours);
    setDays(time.days + time.months * 30 + time.years * 365);
  }, [loading, data, refetchTimer, refetch, locale]);

  const interval = useInterval(tick, 1000);

  useEffect(() => {
    refetchTimer.start();

    return refetchTimer.stop;
  }, []); // eslint-disable-line

  useEffect(() => {
    interval.start();
    return () => {
      interval.stop();
    };
  }, [tick]); // eslint-disable-line

  const almostDone = useMemo(
    () =>
      (!data || data?.status == 1) &&
      +hours == 0 &&
      +days == 0 &&
      +minutes * 60 + +seconds < RED_TIME_S,
    [data, days, hours, minutes, seconds]
  );

  const almostStarted = useMemo(
    () =>
      (!data || data?.status == 0) &&
      +hours == 0 &&
      +days == 0 &&
      +minutes * 60 + +seconds < RED_TIME_S,
    [data, days, hours, minutes, seconds]
  );

  return (
    <>
      {!loading && data && !data.infinite && (
        <div
          className={
            styles.wrapper +
            ' ' +
            (showTimer ? styles.show : '') +
            ' ' +
            (almostDone ? styles.almostDone : '') +
            ' ' +
            (almostStarted ? styles.almostStarted : '')
          }
          onClick={() => {
            setShowTimer((value) => !value);
          }}
        >
          <Icon
            size={'sm'}
            className={styles.iconRoot}
            wrapperClassName={
              styles.iconWrapper +
              ' ' +
              (almostDone || almostStarted ? styles.almostDoneIcon : '')
            }
          >
            <Alarm
              color={
                almostDone
                  ? 'var(--negative)'
                  : almostStarted
                    ? 'var(--positive)'
                    : 'var(--primary)'
              }
            />
          </Icon>
          <div className={styles.timerWrapper}>
            <div
              className={
                styles.before + ' ' + (data.status === 2 ? styles.finished : '')
              }
            >
              {data.status != 2
                ? data.status == 0
                  ? locale.timer.beforeStart
                  : locale.timer.beforeEnd
                : locale.timer.finished}
            </div>
            {data.status !== 2 && (
              <div className={styles.timer}>
                <div className={styles.numberWrapper}>
                  <div className={styles.number}>{days}</div>
                  <div className={styles.numberTitle}>
                    {locale.timer.days(+days)}
                  </div>
                </div>
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Timer);
