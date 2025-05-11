import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import { Modal, TextInput } from '@ui/basics';
import { FC, memo, useCallback } from 'react';

import styles from './styles.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';

const PlagiarismModal: FC<{
  action: () => void;
  isAIGenerated: boolean;
  isOpen: boolean;
  onClose: () => void;
  customStyle?: string;
}> = ({ isOpen, onClose, isAIGenerated, action }) => {
  const { locale } = useLocale();

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={locale.attempt.aiGenerated.modalConfirmAction}
    >
      <div className={styles.body}>
        <span className={styles.title}>
          {isAIGenerated
            ? locale.attempt.aiGenerated.unbanConfirmation
            : locale.attempt.aiGenerated.banConfirmation}
        </span>
        <SimpleButtonGroup
          reversePositive={false}
          actionButton={{
            onClick: () => {
              action();
              onClose();
            },
            label: locale.attempt.aiGenerated.confirm,
          }}
          cancelButton={{
            onClick: onClose,
            label: locale.attempt.aiGenerated.cancel,
          }}
        />
      </div>
    </Modal>
  );
};

export default memo(PlagiarismModal);
