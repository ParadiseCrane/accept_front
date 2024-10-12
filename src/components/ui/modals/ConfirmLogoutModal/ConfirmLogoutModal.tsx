import { pureCallback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { Icon } from '@ui/basics';
import { FC, ReactNode, memo, useCallback, useState } from 'react';
import styles from './confirmLogoutModal.module.css';
import { Trash } from 'tabler-icons-react';

const ConfirmLogoutModal: FC<{
  confirm: pureCallback<void>;
  kind?: 'positive' | 'negative';
  onClose?: pureCallback<void>;
  disabled?: boolean;
  openMenu: pureCallback<void>;
  closeMenu: pureCallback<void>;
}> = ({
  confirm,
  onClose = () => {},
  disabled,
  kind,
  openMenu,
  closeMenu,
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
      <Icon
        size="xs"
        onClick={() => {
          openModal();
          openMenu();
        }}
        className={styles.trash_icon}
      >
        <Trash color="#00000060" />
      </Icon>
      <SimpleModal
        opened={opened}
        close={closeModal}
        title={locale.sure}
        classNames={{ body: styles.wrapper }}
      >
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
