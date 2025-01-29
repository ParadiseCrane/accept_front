import { IUser } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import deleteModalStyles from '@styles/ui/deleteModal.module.css';
import { Button } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useState } from 'react';

import styles from './profileDeleteModal.module.css';

const ProfileDeleteModal: FC<{
  user: IUser;
  opened: boolean;
  setOpened: (_: boolean) => void;
}> = ({ user, opened, setOpened }) => {
  const { locale, lang } = useLocale();
  const [toList, setToList] = useState(false);

  const close = useCallback(() => setOpened(false), [setOpened]);

  const handleSubmit = useCallback(() => {
    requestWithNotify(
      `user/delete/${user.login}`,
      'DELETE',
      locale.notify.user.delete,
      lang,
      () => '',
      undefined,
      () => setToList(true),
      { autoClose: 8000 }
    );
  }, [locale, lang, user.login]);

  return (
    <SimpleModal
      opened={opened}
      close={close}
      title={locale.user.modals.deletion}
    >
      <div className={styles.wrapper}>
        <div className={styles.text}>
          {`${locale.user.modals.delete} '${user.login}' ?`}
        </div>
        {!toList ? (
          <SimpleButtonGroup
            actionButton={{
              label: locale.delete,
              onClick: handleSubmit,
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: close,
            }}
            reversePositive
          />
        ) : (
          <Button
            variant="outline"
            href="/user/list"
            targetWrapperClassName={deleteModalStyles.toListButton}
          >
            {locale.toList}
          </Button>
        )}
      </div>
    </SimpleModal>
  );
};

export default memo(ProfileDeleteModal);
