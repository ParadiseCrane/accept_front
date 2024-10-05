import { link } from '@constants/Avatar';
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
// TODO продолжить добавление организаций
// какие данные как запрашивать?
// есть ли отдельный запрос только для людей с логином? только для людей с организацией?
// для людей с логином и организацией?
// какие запросы отвечают за каждый из вариантов?
const UserAvatar: FC<AvatarProps> = ({
  login,
  organization,
  ...props
}) => {
  return (
    <MantineAvatar
      src={login ? link(login + organization) : undefined}
      size="lg"
      radius="lg"
      {...props}
    />
  );
};

export default memo(UserAvatar);
