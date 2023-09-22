import { FC, memo, useCallback, useState } from 'react';
import { Trash } from 'tabler-icons-react';
import { useLocale } from '@hooks/useLocale';
import { Item } from '@custom-types/ui/atomic';

import { pureCallback } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import modalStyles from '@styles/ui/modal.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import { Icon } from '@ui/basics';

const DeleteTag: FC<{
  item: Item;
  deleteURL: string;
  refetch: pureCallback<void>;
}> = ({ item, refetch, deleteURL }) => {
  const [opened, setOpened] = useState(false);
  const { locale, lang } = useLocale();

  const handleSubmit = useCallback(() => {
    requestWithNotify<{ spec: string }, any>(
      deleteURL,
      'POST',
      locale.tag.delete,
      lang,
      (_: any) => '',
      {
        spec: item.spec,
      },
      () => {
        refetch();
        setOpened(false);
      },
      { autoClose: 5000 }
    );
  }, [deleteURL, locale.tag.delete, lang, item.spec, refetch]);

  return (
    <>
      <Icon onClick={() => setOpened(true)} color="red" size="xs">
        <Trash />
      </Icon>
      <SimpleModal
        opened={opened}
        close={() => setOpened(false)}
        title={locale.ui.tagSelector.delete + ` '${item.title}'`}
      >
        <div className={modalStyles.verticalContent}>
          <div>{locale.ui.tagSelector.deleteConfidence}</div>
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

export default memo(DeleteTag);
