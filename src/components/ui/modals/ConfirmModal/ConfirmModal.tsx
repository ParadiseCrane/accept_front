import { pureCallback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { Button } from '@ui/basics';
import { FC, ReactNode, memo, useCallback, useState } from 'react';
import styles from './confirmModal.module.css';

const ConfirmModal: FC<{
  buttonText: string;
  confirm: pureCallback<void>;
  kind?: 'positive' | 'negative';
  onClose?: pureCallback<void>;
  disabled?: boolean;
  children?: ReactNode;
}> = ({
  buttonText,
  confirm,
  onClose = () => {},
  children,
  disabled,
  kind,
}) => {
  const { locale } = useLocale();
  const [opened, setOpened] = useState(false);

  const openModal = useCallback(() => setOpened(true), []);
  const closeModal = useCallback(() => {
    onClose();
    setOpened(false);
  }, [onClose]);

  const onConfirm = useCallback(() => {
    confirm();
    closeModal();
  }, [confirm, closeModal]);

  return (
    <>
      <Button kind={kind} variant="outline" onClick={openModal}>
        {buttonText}
      </Button>
      <SimpleModal
        opened={opened}
        close={closeModal}
        title={locale.sure}
        classNames={{ body: styles.wrapper }}
      >
        {children}
        <SimpleButtonGroup
          reversePositive
          actionButton={{
            onClick: onConfirm,
            props: { disabled },
          }}
          cancelButton={{ onClick: closeModal }}
        />
      </SimpleModal>
    </>
  );
};

export default memo(ConfirmModal);
