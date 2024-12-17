import { link } from '@constants/Avatar';
import { useUser } from '@hooks/useUser';
import {
  Avatar as MantineAvatar,
  AvatarProps as MantineAvatarProps,
} from '@mantine/core';
import { FC, memo } from 'react';
// import styles from './UserAvatar.module.css'

interface AvatarProps extends MantineAvatarProps {
  login?: string;
  organization?: string;
}

const UserAvatar: FC<AvatarProps> = ({ login, organization, ...props }) => {
  const { user } = useUser();
  const organizationLocal = organization ?? user?.organization;
  return (
    <MantineAvatar
      src={login ? link(login + organizationLocal) : undefined}
      size="lg"
      radius="lg"
      {...props}
    />
  );
};

export default memo(UserAvatar);
