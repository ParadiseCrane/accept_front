import { pureCallback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { FC, ReactNode, memo, useCallback, useState } from 'react';
import styles from './confirmLogoutModal.module.css';

const ConfirmLogoutModal: FC<{
  confirm: pureCallback<void>;
  kind?: 'positive' | 'negative';
  onClose?: pureCallback<void>;
  disabled?: boolean;
  openMenu: pureCallback<void>;
  closeMenu: pureCallback<void>;
  modalText?: string;
  children?: ReactNode;
}> = ({
  confirm,
  onClose = () => {},
  disabled,
  kind,
  openMenu,
  closeMenu,
  modalText,
  children,
}) => {
  const { locale } = useLocale();
  const [opened, setOpened] = useState(false);

  const openModal = useCallback(() => setOpened(true), []);
  const closeModal = useCallback(() => {
    onClose();
    setOpened(false);
    closeMenu();
  }, [onClose]);

  const onConfirm = useCallback(() => {
    confirm();
    closeModal();
  }, [confirm, closeModal]);

  return (
    <>
      <div
        onClick={() => {
          openModal();
          openMenu();
        }}
      >
        {children}
      </div>
      <SimpleModal
        opened={opened}
        close={closeModal}
        title={locale.sure}
        classNames={{ body: styles.wrapper }}
      >
        <span>{modalText}</span>
        <SimpleButtonGroup
          reversePositive={false}
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

export default memo(ConfirmLogoutModal);
