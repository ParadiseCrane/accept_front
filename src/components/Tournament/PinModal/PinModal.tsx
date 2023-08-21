import { FC, memo, useEffect, useState } from 'react';
import { useLocale } from '@hooks/useLocale';
import { setter } from '@custom-types/ui/atomic';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { Button, CopyButton } from '@ui/basics';
import { Pin } from '@ui/basics';
import { sendRequest } from '@requests/request';
import styles from './pinModal.module.css';
import { PIN_LENGTH } from '@constants/TournamentSecurity';

const PinModal: FC<{
  spec: string;
  active: boolean;
  setActive: setter<boolean>;
}> = ({ spec, active, setActive }) => {
  const { locale } = useLocale();
  const [pin, setPin] = useState('');

  useEffect(() => {
    sendRequest<undefined, string>(
      `tournament/pin/${spec}`,
      'GET'
    ).then((res) => {
      if (!res.error) {
        setPin(res.response);
      }
    });
  }, [spec]);

  return (
    <>
      <SimpleModal
        opened={active}
        close={() => setActive(false)}
        hideCloseButton
        size="xl"
        title={locale.tournament.modals.pin}
        centered
        classNames={{ body: styles.content }}
      >
        <Pin length={PIN_LENGTH} readOnly value={pin} size="xl" />
        <CopyButton value={pin}>
          {({ copy, copied }) => (
            <Button
              variant="outline"
              kind={copied ? 'positive' : undefined}
              onClick={copy}
            >
              {copied ? locale.copy.done : locale.copy.label}
            </Button>
          )}
        </CopyButton>
      </SimpleModal>
    </>
  );
};

export default memo(PinModal);
