import { FC, memo, useCallback, useMemo } from 'react';
import { IGroup } from '@custom-types/data/IGroup';
import { useLocale } from '@hooks/useLocale';
import { UseFormReturnType } from '@mantine/form';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import styles from './addGrade.module.css';
import { useRequest } from '@hooks/useRequest';
import { IUserDisplay } from '@custom-types/data/IUser';
import Form from '@components/Group/Form/Form';

const initialValues = {
  spec: '',
  name: '',
  readonly: true,
  members: [] as string[],
};

const AddGrade: FC<{}> = ({}) => {
  const { locale, lang } = useLocale();

  const { data } = useRequest<{}, IUserDisplay[]>(
    'user/list-display',
    'GET'
  );
  const users = useMemo(
    () => (data && data.length > 0 ? data : []),
    [data]
  );

  const handleSubmit = useCallback(
    (form: UseFormReturnType<any>) => {
      if (form.validate().hasErrors) {
        const id = newNotification({});
        errorNotification({
          id,
          title: locale.notify.group.validation.error,
          autoClose: 5000,
        });
        return;
      }
      requestWithNotify<
        { group: IGroup; members: string[] },
        boolean
      >(
        'group/add',
        'POST',
        locale.notify.group.create,
        lang,
        (_: boolean) => '',
        {
          group: {
            spec: '',
            name: form.values.name,
            readonly: true,
          },
          members: form.values.members,
        }
      );
    },
    [locale, lang]
  );

  return (
    <div className={styles.wrapper}>
      <Form
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        buttonText={locale.create}
        users={users || []}
        hideReadonly
      />
    </div>
  );
};

export default memo(AddGrade);
