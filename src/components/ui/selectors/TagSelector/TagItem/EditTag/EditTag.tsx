import { FC, memo, useCallback, useState } from 'react';
import { Pencil } from 'tabler-icons-react';
import { useLocale } from '@hooks/useLocale';

import { Item } from '@custom-types/ui/atomic';

import { pureCallback } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import { ITag } from '@custom-types/data/ITag';
import { Icon, TextInput } from '@ui/basics';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import modalStyles from '@styles/ui/modal.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';

const EditTag: FC<{
  item: Item;
  updateURL: string;
  refetch: pureCallback<void>;
  disabled?: boolean;
}> = ({ item, refetch, updateURL, disabled }) => {
  const [opened, setOpened] = useState(false);
  const { locale, lang } = useLocale();
  const [title, setTitle] = useState(item.title);
  const [error, setError] = useState('');

  const validate = useCallback((title: string) => {
    if (title.length >= 3) {
      return true;
    }
    return false;
  }, []);

  const onBlur = useCallback(
    (title: string) => {
      if (validate(title)) {
        return setError('');
      }
      return setError(locale.ui.tagSelector.minLength(locale.name, 3));
    },
    [locale, validate]
  );

  const handleSubmit = useCallback(
    (title: string) => {
      if (validate(title)) {
        requestWithNotify<ITag, boolean>(
          updateURL,
          'POST',
          locale.tag.edit,
          lang,
          (_: boolean) => '',
          {
            spec: item.spec,
            title: title,
            predefined: item.predefined,
          },
          () => {
            refetch();
            setOpened(false);
          },
          { autoClose: 5000 }
        );
      }
    },
    [validate, updateURL, locale.tag.edit, lang, item.spec, refetch]
  );

  return (
    <>
      <Icon
        disabled={disabled}
        onClick={() => setOpened(true)}
        color="var(--primary)"
        size="xs"
      >
        <Pencil />
      </Icon>
      <SimpleModal
        opened={opened}
        close={() => setOpened(false)}
        title={locale.ui.tagSelector.edit}
      >
        <div className={modalStyles.verticalContent}>
          <TextInput
            autoFocus
            required
            shrink
            label={locale.name}
            onChange={(e: any) => setTitle(e.target.value)}
            onBlur={() => onBlur(title)}
            error={error}
            defaultValue={item.title}
          />
          <SimpleButtonGroup
            actionButton={{
              label: locale.save,
              onClick: () => handleSubmit(title),
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

export default memo(EditTag);
