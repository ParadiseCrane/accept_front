import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useLocale } from '@hooks/useLocale';
import { sendRequest } from '@requests/request';
import { PIN_LENGTH } from '@constants/TournamentSecurity';
import { CopyIcon, Icon, Pin } from '@ui/basics';
import { Refresh } from 'tabler-icons-react';
import styles from './pinCode.module.css';

const PinCode: FC<{ origin: string }> = ({ origin }) => {
  const [pin, setPin] = useState('');
  const { locale } = useLocale();

  const fetchPin = useCallback(() => {
    sendRequest<undefined, string>(`pin_code/${origin}`, 'GET').then(
      (res) => {
        if (!res.error) {
          setPin(res.response);
        }
      }
    );
  }, [origin]);

  useEffect(() => {
    fetchPin();
  }, [fetchPin]);

  const refreshPin = useCallback(() => {
    sendRequest<undefined, string>(`pin_code/${origin}`, 'PUT').then(
      (res) => {
        if (!res.error) {
          setPin(res.response);
        }
      }
    );
  }, [origin]);

  return (
    <Pin
      length={PIN_LENGTH}
      readOnly
      value={pin}
      size="lg"
      rightSection={
        <div className={styles.rightSectionWrapper}>
          <CopyIcon
            value={pin}
            iconProps={{
              tooltipLabel: locale.helpers.pin.copy,
              tooltipProps: { offset: 10 },
              size: 'xs',
              color: 'var(--primary)',
            }}
          />
          <Icon
            tooltipLabel={locale.helpers.pin.refresh}
            tooltipProps={{ offset: 10 }}
            size="xs"
            color="var(--primary)"
            onClick={refreshPin}
          >
            <Refresh />
          </Icon>
        </div>
      }
    />
  );
};

export default memo(PinCode);
