import { IAssignmentSchema } from '@custom-types/data/IAssignmentSchema';
import { useLocale } from '@hooks/useLocale';
import { FC, memo, useCallback, useState } from 'react';
import { setter } from '@custom-types/ui/atomic';
import { requestWithNotify } from '@utils/requestWithNotify';
import { Button } from '@ui/basics';
import deleteModalStyles from '@styles/ui/deleteModal.module.css';
import modalStyles from '@styles/ui/modal.module.css';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SimpleButtonGroup from '@ui/SimpleButtonGroup/SimpleButtonGroup';

const DeleteModal: FC<{
  active: boolean;
  setActive: setter<boolean>;
  assignment: IAssignmentSchema;
}> = ({ active, setActive, assignment }) => {
  const { locale, lang } = useLocale();

  const [toList, setToList] = useState(false);

  const handleDelete = useCallback(() => {
    const body = {
      spec: assignment.spec,
    };
    requestWithNotify(
      'assignment_schema/delete',
      'POST',
      locale.notify.assignmentSchema.delete,
      lang,
      (_: any) => '',
      body,
      () => setToList(true)
    );
  }, [assignment, locale, lang]);

  return (
    <>
      <SimpleModal
        opened={active}
        close={() => setActive(false)}
        hideCloseButton
        title={locale.assignmentSchema.modals.deletion}
      >
        <div className={modalStyles.verticalContent}>
          <div>
            {locale.assignmentSchema.modals.delete + ` '${assignment.title}' ?`}
          </div>

          {!toList ? (
            <>
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
            </>
          ) : (
            <Button
              variant="outline"
              href="/assignment_schema/list"
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
