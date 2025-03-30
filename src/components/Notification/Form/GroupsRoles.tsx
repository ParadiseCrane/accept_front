import { IRole } from '@custom-types/data/atomic';
import { IGroup } from '@custom-types/data/IGroup';
import { useLocale } from '@hooks/useLocale';
import { Overlay, Switch } from '@ui/basics';
import { GroupSelector, RoleSelector } from '@ui/selectors';
import { FC, memo, useMemo } from 'react';

const GroupsRoles: FC<{
  form: any;
  groups: IGroup[];
  roles: IRole[];
}> = ({ form, groups, roles }) => {
  const { locale } = useLocale();

  const initialRoles = useMemo(() => form.values.roles, []); //eslint-disable-line
  const initialGroups = useMemo(() => form.values.groups, []); //eslint-disable-line

  return (
    <>
      <Switch
        label={locale.notification.form.broadcast}
        helperContent={
          <div>
            {locale.helpers.notification.broadcast.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        }
        {...form.getInputProps('broadcast', { type: 'checkbox' })}
      />
      <div style={{ position: 'relative' }}>
        {form.values.broadcast && <Overlay />}
        <RoleSelector
          form={form}
          roles={roles}
          initialRoles={initialRoles}
          field={'roles'}
        />
        <GroupSelector
          form={form}
          groups={groups}
          initialGroups={initialGroups}
          field={'groups'}
        />
      </div>
    </>
  );
};

export default memo(GroupsRoles);
