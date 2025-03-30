import { IRole } from '@custom-types/data/atomic';
import { Select } from '@ui/basics';
import { capitalize } from '@utils/capitalize';
import { FC, memo, useMemo } from 'react';

const SingleRoleSelector: FC<{
  label: string;
  form: any;
  field: string;
  roles: IRole[];
}> = ({ label, form, roles, field }) => {
  const data = useMemo(
    () =>
      roles.map((item) => ({
        label: capitalize(item.name),
        value: item.spec.toString(),
      })),
    [roles]
  );
  return (
    <div style={{ width: '100%' }}>
      <Select label={label} data={data} {...form.getInputProps(field)} />
    </div>
  );
};

export default memo(SingleRoleSelector);
