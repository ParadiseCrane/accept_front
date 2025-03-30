import { ITournament } from '@custom-types/data/ITournament';
import { callback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import deleteModalStyles from '@styles/ui/deleteModal.module.css';
import modalStyles from '@styles/ui/modal.module.css';
import { Button } from '@ui/basics';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useState } from 'react';

const DeleteModal: FC<{
  active: boolean;
  setActive: callback<boolean, void>;
  tournament: ITournament;
}> = ({ active, setActive, tournament }) => {
  const { locale, lang } = useLocale();
  const [toList, setToList] = useState(false);

  const handleDelete = useCallback(() => {
    const body = {
      spec: tournament.spec,
    };
    requestWithNotify(
      `tournament/delete`,
      'POST',
      locale.notify.tournament.delete,
      lang,
      (_: any) => '',
      body,
      () => setToList(true),
      { autoClose: 8000 }
    );
  }, [tournament.spec, locale, lang]);

  return (
    <>
      <SimpleModal
        opened={active}
        close={() => setActive(false)}
        hideCloseButton={true}
        title={locale.tournament.modals.deletion}
      >
        <div className={modalStyles.verticalContent}>
          <div>
            {locale.tournament.modals.delete + ` '${tournament.title}' ?`}
          </div>

          {!toList ? (
            <SimpleButtonGroup
              reversePositive
              actionButton={{
                label: locale.delete,
                onClick: handleDelete,
              }}
              cancelButton={{
                label: locale.cancel,
                onClick: () => setActive(false),
              }}
            />
          ) : (
            <Button
              variant="outline"
              href="/tournament/list"
              targetWrapperClassName={deleteModalStyles.toListButton}
            >
              {locale.toList}
            </Button>
          )}
        </div>
      </SimpleModal>
    </>
  );
};

export default memo(DeleteModal);
