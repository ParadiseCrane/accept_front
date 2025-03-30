import { IAttempt } from '@custom-types/data/IAttempt';
import { useLocale } from '@hooks/useLocale';
import modalStyles from '@styles/ui/modal.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SingularSticky from '@ui/Sticky/SingularSticky';
import { getLocalDate } from '@utils/datetime';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useState } from 'react';
import { HeartPlus } from 'tabler-icons-react';

import styles from './banModal.module.css';

const UnbanModal: FC<{ attempt: IAttempt }> = ({ attempt }) => {
  const [opened, setOpened] = useState(false);
  const { locale, lang } = useLocale();

  const handleUnban = useCallback(() => {
    requestWithNotify(
      `attempt/unban/${attempt.spec}`,
      'GET',
      locale.attempt.unban.request,
      lang,
      () => '',
      undefined,
      () => window.location.reload()
    );
  }, [locale, lang, attempt]);

  return (
    <>
      <SingularSticky
        icon={<HeartPlus width={32} height={32} />}
        color="green"
        onClick={() => setOpened(true)}
        description={locale.tip.sticky.attempt.unban}
      />
      <SimpleModal
        title={locale.attempt.unban.title}
        helperContent={
          <div>
            {locale.helpers.attempt.unban.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        }
        opened={opened}
        close={() => setOpened(false)}
      >
        <div className={modalStyles.verticalContent}>
          <div className={styles.rowsWrapper}>
            <div>
              {locale.attempt.unban.previousBanDate}{' '}
              {`${getLocalDate(attempt.banInfo?.date || new Date())}`}
            </div>
            <div>
              {locale.attempt.unban.previousBanRequester}{' '}
              {attempt.banInfo?.requester || ''}
            </div>
            <div>
              {locale.attempt.unban.previousBanReason}{' '}
              {attempt.banInfo?.reason || ''}
            </div>
          </div>
          <SimpleButtonGroup
            actionButton={{
              label: locale.attempt.unban.action,
              onClick: handleUnban,
            }}
            cancelButton={{
              label: locale.cancel,
              onClick: () => setOpened(false),
            }}
          />
        </div>
      </SimpleModal>
    </>
  );
};

export default memo(UnbanModal);
