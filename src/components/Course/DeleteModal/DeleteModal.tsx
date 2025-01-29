import { IAssignmentSchema } from '@custom-types/data/IAssignmentSchema';
import { ICourseModel } from '@custom-types/data/ICourse';
import { setter } from '@custom-types/ui/atomic';
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
  setActive: setter<boolean>;
  course: ICourseModel;
}> = ({ active, setActive, course }) => {
  const { locale, lang } = useLocale();

  const [toList, setToList] = useState(false);

  const handleDelete = useCallback(() => {
    const body = {
      spec: course.spec,
    };
    requestWithNotify(
      'course/delete',
      'POST',
      locale.notify.course.delete,
      lang,
      (_: any) => '',
      body,
      () => setToList(true)
    );
  }, [course, locale, lang]);

  return (
    <>
      <SimpleModal
        opened={active}
        close={() => setActive(false)}
        hideCloseButton
        title={locale.course.modals.deletion}
      >
        <div className={modalStyles.verticalContent}>
          <div>{locale.course.modals.delete + ` '${course.title}'?`}</div>

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
              // TODO заменить на список курсов
              href="/course/add"
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
