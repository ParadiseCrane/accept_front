import { IAssignmentDisplay } from '@custom-types/data/IAssignment';
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
  assignment: IAssignmentDisplay;
}> = ({ active, setActive, assignment }) => {
  const { locale, lang } = useLocale();
  const [toList, setToList] = useState(false);

  const handleDelete = useCallback(() => {
    const body = {
      spec: assignment.spec,
    };
    requestWithNotify(
      'assignment/delete',
      'POST',
      locale.notify.assignment.delete,
      lang,
      (_: any) => '',
      body,
      () => setToList(true),
      { autoClose: 8000 }
    );
  }, [assignment.spec, locale, lang]);

  return (
    <>
      <SimpleModal
        opened={active}
        close={() => setActive(false)}
        hideCloseButton
        title={locale.assignment.modals.deletion}
      >
        <div className={modalStyles.verticalContent}>
          <div>
            {locale.assignment.modals.delete + ` '${assignment.title}' ?`}
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
              href="/profile/me?section=assignments"
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
