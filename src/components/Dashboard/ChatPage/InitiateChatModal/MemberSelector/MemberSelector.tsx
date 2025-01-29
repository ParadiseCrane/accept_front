import { IActivity } from '@custom-types/data/atomic';
import { IUserDisplay } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { sendRequest } from '@requests/request';
import { UserSelect } from '@ui/selectors';
import { FC, memo, useEffect, useState } from 'react';

const MemberSelector: FC<{
  spec: string;
  entity: IActivity;
  opened: boolean;
  exclude: string[];
  form: any;
  field: string;
  // select: (_: IUserDisplay) => void;
  // onChange: () => any;
}> = ({ entity, spec, opened, exclude, form, field }) => {
  const { locale } = useLocale();
  const [users, setUsers] = useState<IUserDisplay[]>([]);

  useEffect(() => {
    if (!opened) return;
    sendRequest<{ exclude: string[] }, IUserDisplay[]>(
      `${entity}/participants/${spec}`,
      'POST',
      { exclude }
    ).then((res) => {
      if (!res.error) {
        setUsers(res.response);
      }
    });
  }, [opened, spec, entity, exclude]);

  return (
    <>
      <UserSelect
        label={locale.dashboard.chat.userModal.user.label}
        placeholder={locale.dashboard.chat.userModal.user.placeholder}
        nothingFound={locale.dashboard.chat.userModal.user.nothingFound}
        users={users}
        select={(users: IUserDisplay[] | undefined) => {
          if (users) form.setFieldValue('user', users[0].login.trim());
        }}
        additionalProps={form.getInputProps(field)}
      />
    </>
  );
};

export default memo(MemberSelector);
