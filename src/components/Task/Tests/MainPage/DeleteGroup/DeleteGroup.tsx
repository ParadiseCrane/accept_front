import { setter } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import modalStyles from '@styles/ui/modal.module.css';
import { Icon } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useState } from 'react';
import { Trash } from 'tabler-icons-react';

const DeleteGroup: FC<{
  task_spec: string;
  index: number;
  refetch: setter<boolean>;
}> = ({ index, task_spec, refetch }) => {
  const [opened, setOpened] = useState(false);
  const { locale, lang } = useLocale();

  const handleSubmit = useCallback(() => {
    requestWithNotify<undefined, boolean>(
      `test_group/${task_spec}/${index}`,
      'DELETE',
      locale.notify.test_group.delete,
      lang,
      (_: boolean) => '',
      undefined,
      () => {
        refetch(false);
        setOpened(false);
      }
    );
  }, [index, task_spec, locale, lang, refetch]);

  return (
    <>
      <Icon
        onClick={() => setOpened(true)}
        color="red"
        size="xs"
        tooltipLabel={locale.ui.taskTest.delete.group}
      >
        <Trash />
      </Icon>
      <SimpleModal
        opened={opened}
        close={() => setOpened(false)}
        title={`${locale.ui.taskTest.delete.group} #${index + 1}`}
      >
        <div className={modalStyles.verticalContent}>
          <div>{locale.ui.taskTest.deleteConfidence.group(index + 1)}</div>
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

export default memo(DeleteGroup);
