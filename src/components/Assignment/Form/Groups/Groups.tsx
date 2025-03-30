import { IGroup } from '@custom-types/data/IGroup';
import { GroupSelector } from '@ui/selectors';
import { FC, memo, useMemo } from 'react';

const Groups: FC<{ form: any; groups: IGroup[] }> = ({ form, groups }) => {
  const initialGroups = useMemo(() => form.values.groups, []); //eslint-disable-line
  return (
    <>
      <GroupSelector
        width="80%"
        form={form}
        groups={groups}
        initialGroups={initialGroups}
        field={'groups'}
      />
    </>
  );
};

export default memo(Groups);
