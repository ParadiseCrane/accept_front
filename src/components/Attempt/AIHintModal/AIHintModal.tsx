import { IAttempt } from '@custom-types/data/IAttempt';
import { useLocale } from '@hooks/useLocale';
import { sendRequest } from '@requests/request';
import { Modal } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { FC, memo, useCallback, useState } from 'react';

import styles from './aiHint.module.css';
import { requestWithNotify } from '@utils/requestWithNotify';

const AIHintModal: FC<{
  opened: boolean;
  onClose: () => void;
  aiHint: string;
  spec: string;
}> = ({ aiHint, onClose, opened, spec }) => {
  const { locale, lang } = useLocale();
  const [sending, setSending] = useState(false);

  const onClick = useCallback(
    async (helpful: boolean) => {
      setSending(true);
      await requestWithNotify<{ helpful: boolean }, boolean>(
        `helpful/attempt-hint/${spec}`,
        'POST',
        locale.notify.attempt.feedback,
        lang,
        (_: boolean) => '',
        {
          helpful: helpful,
        }
      );
      setSending(false);
      onClose();
    },
    [lang, locale.notify.attempt.feedback, onClose, spec]
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={locale.attempt.aiHint.title}
      size={'lg'}
    >
      <div className={styles.body}>
        <span>{aiHint}</span>
        <SimpleButtonGroup
          actionButton={{
            label: locale.attempt.aiHint.helpful,
            onClick: sending ? () => {} : () => onClick(true),
          }}
          cancelButton={{
            label: locale.attempt.aiHint.notHelpful,
            onClick: sending ? () => {} : () => onClick(false),
          }}
        />
      </div>
    </Modal>
  );

  // return (
  //   <>
  //     <SimpleModal
  //       title={locale.attempt.ban.title}
  //       helperContent={
  //         <div>
  //           {locale.helpers.attempt.ban.map((p, idx) => (
  //             <p key={idx}>{p}</p>
  //           ))}
  //         </div>
  //       }
  //       opened={opened}
  //       close={() => setOpened(false)}
  //       withCloseButton={true}
  //     >
  //       <div className={modalStyles.verticalContent}>
  //         <SimpleButtonGroup
  //           actionButton={{
  //             label: buttonText,
  //             onClick: onClick,
  //           }}
  //           cancelButton={{
  //             label: locale.close,
  //             onClick: () => setOpened(false),
  //           }}
  //         />
  //       </div>
  //     </SimpleModal>
  //   </>
  // );
};

export default memo(AIHintModal);
