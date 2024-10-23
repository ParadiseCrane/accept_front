import React, { FC, memo } from 'react';
import styles from './userLoginOrganization.module.css';

const UserLoginOrganization: FC<{
  login: string;
  organization: string;
}> = ({ login, organization }) => {
  return (
    <div className={styles.user_login_organization}>
      <span className={styles.login}>{login}</span>
      <span className={styles.organization}>{organization}</span>
    </div>
  );
};

export default memo(UserLoginOrganization);
