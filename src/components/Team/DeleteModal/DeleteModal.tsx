import { ITeam } from '@custom-types/data/ITeam';
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
  team: ITeam;
}> = ({ active, setActive, team }) => {
  const { locale, lang } = useLocale();
  const [toList, setToList] = useState(false);

  const handleDelete = useCallback(() => {
    requestWithNotify(
      `team/delete/${team.spec}`,
      'POST',
      locale.notify.team.delete,
      lang,
      (_: any) => '',
      undefined,
      () => setToList(true),
      { autoClose: 8000 }
    );
  }, [team.spec, locale, lang]);

  return (
    <>
      <SimpleModal
        opened={active}
        close={() => setActive(false)}
        hideCloseButton={true}
        title={locale.team.modals.deletion}
      >
        <div className={modalStyles.verticalContent}>
          <div>{locale.team.modals.delete + ` '${team.name}' ?`}</div>

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
              {locale.toTournaments}
            </Button>
          )}
        </div>
      </SimpleModal>
    </>
  );
};

export default memo(DeleteModal);
