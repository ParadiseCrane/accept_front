import { IRole } from '@custom-types/data/atomic';
import { IGroup } from '@custom-types/data/IGroup';
import { IUserDisplay } from '@custom-types/data/IUser';
import { INewNotification } from '@custom-types/data/notification';
import { useLocale } from '@hooks/useLocale';
import { useForm } from '@mantine/form';
import Stepper from '@ui/Stepper/Stepper';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback } from 'react';

import DescriptionInfo from './DescriptionInfo';
import GroupsRoles from './GroupsRoles';
import MainInfo from './MainInfo';
import Users from './Users';

const stepFields = [
  ['title', 'author'],
  ['shortDescription', 'description'],
  [],
  ['logins', 'groups', 'roles'],
];

const Form: FC<{
  users: IUserDisplay[];
  groups: IGroup[];
  roles: IRole[];
  noDefault?: boolean;
}> = ({ users, groups, roles, noDefault }) => {
  const { locale, lang } = useLocale();

  const form = useForm({
    initialValues: {
      spec: '',
      title: '',
      author: '',
      shortDescription: '',
      description: '',
      logins: [],
      broadcast: false,
      groups: [],
      roles: [],
    },
    validate: {
      title: (value) =>
        value.length < 5 ? locale.notification.form.validate.title : null,

      shortDescription: () => null,
      description: (value) =>
        value.length < 20
          ? locale.notification.form.validate.description
          : null,

      logins: (value, values) =>
        !values.broadcast &&
        !(values.logins.length > 0) &&
        !(values.groups.length > 0) &&
        !(values.roles.length > 0)
          ? locale.notification.form.validate.users
          : null,
      groups: (value, values) =>
        !values.broadcast &&
        !(values.logins.length > 0) &&
        !(values.groups.length > 0) &&
        !(values.roles.length > 0)
          ? locale.notification.form.validate.users
          : null,
      roles: (value, values) =>
        !values.broadcast &&
        !(values.logins.length > 0) &&
        !(values.groups.length > 0) &&
        !(values.roles.length > 0)
          ? locale.notification.form.validate.users
          : null,
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = useCallback(() => {
    if (form.validate().hasErrors) {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.validationError,
        autoClose: 5000,
      });
      return;
    }
    const body: INewNotification = {
      ...form.values,
    };
    requestWithNotify<INewNotification, string>(
      'notification/add',
      'POST',
      locale.notify.notification.create,
      lang,
      (_: string) => '',
      body
    );
  }, [form, locale, lang]);

  return (
    <>
      <Stepper
        buttonLabel={locale.create}
        form={form}
        handleSubmit={handleSubmit}
        stepFields={stepFields}
        noDefault={noDefault}
        pages={[
          <MainInfo key="1" form={form} />,
          <DescriptionInfo key="2" form={form} />,
          <GroupsRoles key="3" form={form} groups={groups} roles={roles} />,
          <Users key="4" form={form} users={users} />,
        ]}
        labels={locale.notification.form.steps.labels}
        descriptions={locale.notification.form.steps.descriptions}
      />
    </>
  );
};

export default memo(Form);
