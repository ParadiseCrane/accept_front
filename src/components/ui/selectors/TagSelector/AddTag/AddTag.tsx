import { FC, memo, useCallback, useState } from 'react';
import { Plus } from 'tabler-icons-react';
import { useLocale } from '@hooks/useLocale';
import { pureCallback } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import { Icon, TextInput } from '@ui/basics';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import modalStyles from '@styles/ui/modal.module.css';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';

const AddTag: FC<{ refetch: pureCallback<void>; addURL: string }> = ({
  refetch,
  addURL,
}) => {
  const [opened, setOpened] = useState(false);
  const { locale, lang } = useLocale();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const validate = useCallback(
    (title: string) => {
      if (title.length >= 3) {
        setError('');
        return true;
      }
      setError(locale.ui.tagSelector.minLength(locale.name, 3));
      return false;
    },
    [locale.name, locale.ui.tagSelector]
  );

  const handleSubmit = useCallback(
    (title: string) => {
      if (validate(title)) {
        requestWithNotify<{ title: string }, string>(
          addURL,
          'POST',
          locale.tag.add,
          lang,
          (response) => response,
          {
            title: title,
          },
          () => {
            refetch();
            setOpened(false);
          },
          { autoClose: 5000 }
        );
      }
    },
    [addURL, lang, locale.tag.add, refetch, validate]
  );

  return (
    <>
      <Icon onClick={() => setOpened(true)} size="sm">
        <Plus color="var(--positive)" />
      </Icon>
      <SimpleModal
        opened={opened}
        close={() => setOpened(false)}
        title={locale.ui.tagSelector.add}
      >
        <div className={modalStyles.verticalContent}>
          <TextInput
            shrink
            autoFocus
            required
            label={locale.name}
            onChange={(e: any) => {
              validate(e.target.value);
              setTitle(e.target.value);
            }}
            error={error}
            placeholder={locale.ui.tagSelector.addPlaceholder}
          />
          <SimpleButtonGroup
            actionButton={{
              label: locale.create,
              onClick: () => handleSubmit(title),
              props: {
                disabled: !!error,
              },
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

export default memo(AddTag);
