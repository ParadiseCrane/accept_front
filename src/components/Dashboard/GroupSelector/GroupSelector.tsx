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

import styles from './styles.module.css';

const GroupSelector: FC<{ url: string }> = ({ url }: { url: string }) => {
  const [showTimer, setShowTimer] = useState(false);
  const { locale } = useLocale();

  // const { data, loading, refetch } = useRequest<{}, BaseTimeInfo, TimeInfo>(
  //   url,
  //   'GET',
  //   undefined,
  //   (data) => ({
  //     start: data.start,
  //     end: data.end,
  //     infinite: data.infinite || false,
  //     status: data.status,
  //   })
  // );

  return (
    <>
      {/* {!loading && data && !data.infinite && ( */}
      {
        <div
          className={styles.wrapper + ' ' + (showTimer ? styles.show : '')}
          onClick={() => {
            setShowTimer((value) => !value);
          }}
        >
          <Icon
            size={'sm'}
            className={styles.iconRoot}
            wrapperClassName={styles.iconWrapper}
          >
            <Alarm color={'var(--primary)'} />
          </Icon>
          <div className={styles.timerWrapper}>
            <div className={styles.before}>{locale.timer.finished}</div>
            <div className={styles.timer}>{'text'}</div>
          </div>
        </div>
      }
    </>
  );
};

export default memo(GroupSelector);
