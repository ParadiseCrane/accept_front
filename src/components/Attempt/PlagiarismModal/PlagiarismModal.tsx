import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import { Modal, TextInput } from '@ui/basics';
import {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useState,
} from 'react';

import styles from './styles.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { sendRequest } from '@requests/request';

const PlagiarismModal: FC<{
  setIsAIGen: Dispatch<SetStateAction<boolean>>;
  isAIGenerated: boolean;
  isOpen: boolean;
  onClose: () => void;
  customStyle?: string;
  attemptSpec: string;
}> = ({ isOpen, onClose, isAIGenerated, attemptSpec, setIsAIGen }) => {
  const { locale } = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!isLoading) {
      setIsLoading(true);
      await sendRequest<{}, string>(`attempt/toggle_ai/${attemptSpec}`, 'GET');
      setIsAIGen((state) => !state);
      onClose();
      setIsLoading(false);
    }
  }, [attemptSpec, setIsAIGen, isLoading, onClose]);

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
            onClick: handleClick,
            label: isLoading
              ? locale.loading
              : locale.attempt.aiGenerated.confirm,
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
