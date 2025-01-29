import { IUser } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { Badge } from '@mantine/core';
import { FC, memo } from 'react';

import styles from './groupsInfo.module.css';

const GroupsInfo: FC<{ user: IUser }> = ({ user }) => {
  const { locale } = useLocale();
  return (
    <div className={styles.wrapper}>
      {user.groups.length > 0 && (
        <div className={styles.groupSection}>
          <div className={styles.groupTitle}>
            {' '}
            {`${locale.profile.groups}:`}
          </div>
          <div className={styles.groupList}>
            {user.groups.map((group, index) => (
              <Badge key={index} size="lg">
                {group.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(GroupsInfo);
