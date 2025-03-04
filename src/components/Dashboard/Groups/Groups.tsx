import { FC, memo, useEffect, useState } from 'react';
import styles from './style.module.css';
import { useLocale } from '@hooks/useLocale';
import { useRequest } from '@hooks/useRequest';
import { IGroupInvite } from '@custom-types/data/IGroup';

const Groups: FC<{
  spec: string;
}> = ({ spec }) => {
  const { locale } = useLocale();
  const [groups, setGroups] = useState<IGroupInvite[]>([]);
  const { data, loading } = useRequest<{}, IGroupInvite[]>(
    `invite/${spec}/all`,
    'GET',
    undefined
  );

  console.log('data', data);

  useEffect(() => {
    if (data) {
      setGroups(data);
    }
  }, [data]);

  if (!data || loading) {
    // TODO добавить loader
    return <></>;
  }

  return (
    <div>
      {groups.map((group) => {
        return (
          <div className={styles.wrapper} key={group.invite}>
            <div>{group.invite}</div>
            <div>{group.group.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Groups);
