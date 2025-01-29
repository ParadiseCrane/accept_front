import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { Button } from '@ui/basics';
import PinCode from '@ui/PinCode/PinCode';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { FC, memo, useCallback } from 'react';

import styles from './pinModal.module.css';

const PinModal: FC<{
  origin: string;
  active: boolean;
  setActive: setter<boolean>;
}> = ({ origin, active, setActive }) => {
  const { locale } = useLocale();

  const close = useCallback(() => setActive(false), [setActive]);

  return (
    <>
      <SimpleModal
        opened={active}
        close={close}
        hideCloseButton
        size="xl"
        title={locale.tournament.modals.pin}
        centered
        classNames={{ body: styles.content }}
      >
        <PinCode origin={origin} />
        <Button onClick={close} kind="negative" variant="outline">
          {locale.close}
        </Button>
      </SimpleModal>
    </>
  );
};

export default memo(PinModal);
