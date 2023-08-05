import { FC, memo, useCallback, useState } from 'react';
import { Trash } from 'tabler-icons-react';
import { useLocale } from '@hooks/useLocale';
import { pureCallback } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import modalStyles from '@styles/ui/modal.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { Icon } from '@ui/basics';
import { ITruncatedTaskTest } from '@custom-types/data/ITaskTest';

const DeleteTest: FC<{
  index: number;
  test: ITruncatedTaskTest;
  refetch: pureCallback<void>;
}> = ({ index, test, refetch }) => {
  const [opened, setOpened] = useState(false);
  const { locale, lang } = useLocale();

  const handleSubmit = useCallback(() => {
    requestWithNotify<undefined, boolean>(
      `task_test/delete/${test.spec}`,
      'DELETE',
      locale.notify.task_test.delete,
      lang,
      (_: boolean) => '',
      undefined,
      () => {
        refetch();
        setOpened(false);
      }
    );
  }, [test.spec, locale.notify.task_test.delete, lang, refetch]);

  return (
    <>
      <Icon
        onClick={() => setOpened(true)}
        color="red"
        size="xs"
        tooltipLabel={locale.ui.taskTest.delete}
      >
        <Trash />
      </Icon>
      <SimpleModal
        opened={opened}
        close={() => setOpened(false)}
        title={`${locale.ui.taskTest.delete} #${index + 1}`}
      >
        <div className={modalStyles.verticalContent}>
          <div>{locale.ui.taskTest.deleteConfidence(index + 1)}</div>
          <SimpleButtonGroup
            reversePositive
            actionButton={{
              label: locale.delete,
              onClick: handleSubmit,
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

export default memo(DeleteTest);
