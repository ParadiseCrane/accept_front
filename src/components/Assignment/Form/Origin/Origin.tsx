import { IAssignmentSchemaDisplay } from '@custom-types/data/IAssignmentSchema';
import { useLocale } from '@hooks/useLocale';
import { CustomEditor, Helper, TextInput } from '@ui/basics';
import { AssignmentSchemaSelector } from '@ui/selectors';
import { FC, memo } from 'react';

import styles from './origin.module.css';

const Origin: FC<{
  form: any;
  shouldNotify?: boolean;
  assignmentSchemas: IAssignmentSchemaDisplay[];
}> = ({ form, assignmentSchemas, shouldNotify }) => {
  const { locale } = useLocale();

  return (
    <>
      <AssignmentSchemaSelector
        key={2}
        form={form}
        field={'origin'}
        schemas={assignmentSchemas}
      />
      {shouldNotify && (
        <div className={styles.notificationWrapper}>
          <div className={styles.notificationLabel}>
            <div>{locale.notification.notification}</div>
            <Helper
              dropdownContent={locale.helpers.notification.assignmentCreation}
            />
          </div>
          <TextInput
            label={locale.notification.form.title}
            required
            {...form.getInputProps('notificationTitle')}
          />
          <TextInput
            label={locale.notification.form.shortDescription}
            helperContent={
              <div>
                {locale.helpers.notification.shortDescription.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            }
            {...form.getInputProps('notificationShortDescription')}
          />
          <CustomEditor
            helperContent={
              <div>
                {locale.helpers.notification.description.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            }
            label={locale.notification.form.description}
            form={form}
            name={'notificationDescription'}
          />
        </div>
      )}
    </>
  );
};

export default memo(Origin);
