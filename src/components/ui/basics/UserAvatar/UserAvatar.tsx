import { link } from '@constants/Avatar';
import {
  Avatar as MantineAvatar,
  AvatarProps as MantineAvatarProps,
} from '@mantine/core';
import { FC, memo } from 'react';
// import styles from './UserAvatar.module.css'

interface AvatarProps extends MantineAvatarProps {
  login?: string;
}

const UserAvatar: FC<AvatarProps> = ({ login, ...props }) => {
  return (
    <MantineAvatar
      src={login ? link(login) : undefined}
      size="lg"
      radius="lg"
      {...props}
    />
  );
};

export default memo(UserAvatar);
