import { IUser } from '@custom-types/data/IUser';
import { Badge } from '@mantine/core';
import { FC, memo } from 'react';
import styles from './mainInfo.module.css';
import { Medal2 } from 'tabler-icons-react';
import { UserAvatar } from '@ui/basics';

const getRoleColor = (accessLevel: number) => {
  switch (accessLevel) {
    case 1:
      return '#2ea3f2';
    case 2:
      return '#1c7ed6';
    case 3:
      return '#aa00ff';
    default:
      return '#ff5050';
  }
};

const getRatingColor = (rating: number) => {
  switch (rating) {
    case 1:
      return '#FFD700';
    case 2:
      return '#C0C0C0';
    case 3:
      return '#CD7f32';
    default:
      return '';
  }
};

const MainInfo: FC<{ user: IUser; place?: number }> = ({ user, place }) => {
  return (
    <div className={styles.main}>
      <div className={styles.avatarWrapper}>
        <UserAvatar login={user.login} size="xl" />
        {place && place < 4 && (
          <Medal2
            strokeWidth={0.8}
            size={'45px'}
            fill={getRatingColor(place)}
            className={styles.medal}
          />
        )}
      </div>
      <div className={styles.text}>
        <div className={styles.nameWrapper}>
          <div className={styles.fullName}>
            <span className={styles.name}>{user.surname}</span>
            <span className={styles.name}>{user.name}</span>
            {user.patronymic.length > 0 && (
              <span className={styles.name}>{user.patronymic}</span>
            )}
          </div>
          <Badge color={getRoleColor(user.role.accessLevel)}>
            {user.role.name}
          </Badge>
        </div>
        <div className={styles.login}>{user.login}</div>
      </div>
    </div>
  );
};

export default memo(MainInfo);
