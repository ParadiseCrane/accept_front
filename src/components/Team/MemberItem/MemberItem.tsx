import { ITeam } from '@custom-types/data/ITeam';
import { IUserDisplay } from '@custom-types/data/IUser';
import { FC, memo } from 'react';
import Link from 'next/link';
import styles from './memberItem.module.css';
import { Avatar } from '@mantine/core';
import { link } from '@constants/Avatar';

const MemberItem: FC<{
  team: ITeam;
  participant: IUserDisplay;
}> = ({ team: _team, participant }) => {
  return (
    <Link
      href={`/profile/${participant.login}`}
      className={styles.link}
    >
      <Avatar src={link(participant.login)} size="lg" radius="lg" />
      <div>{participant.shortName}</div>
    </Link>
  );
};

export default memo(MemberItem);
