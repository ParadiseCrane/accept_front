import { FC, memo } from 'react';
import { useLocale } from '@hooks/useLocale';
import { setter } from '@custom-types/ui/atomic';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import styles from './pinModal.module.css';
import PinCode from '@ui/PinCode/PinCode';
import { Button } from '@ui/basics';

const PinModal: FC<{
  origin: string;
  active: boolean;
  setActive: setter<boolean>;
}> = ({ origin, active, setActive }) => {
  const { locale } = useLocale();
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
        <PinCode origin={origin} />
        <Button kind="negative" variant="outline">
          {locale.close}
        </Button>
      </SimpleModal>
    </>
  );
};

export default memo(PinModal);
