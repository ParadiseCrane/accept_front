import { ITeam } from '@custom-types/data/ITeam';
import { IUserDisplay } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { Icon, UserAvatar } from '@ui/basics';
import { requestWithNotify } from '@utils/requestWithNotify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, memo, useCallback } from 'react';
import { CircleMinus } from 'tabler-icons-react';

import styles from './memberItem.module.css';

const MemberItem: FC<{
  team: ITeam;
  participant: IUserDisplay;
  special?: boolean;
}> = ({ team, participant, special }) => {
  const { locale, lang } = useLocale();
  const router = useRouter();

  const deleteUser = useCallback(() => {
    requestWithNotify(
      `team/removeParticipants/${team.spec}`,
      'POST',
      locale.notify.team.kickParticipant,
      lang,
      () => '',
      [participant.login]
    ).then((res) => {
      if (!res.error) {
        router.reload();
      }
    });
  }, [router, locale, lang, team, participant]);

  return (
    <div className={styles.wrapper}>
      <Link href={`/profile/${participant.login}`} className={styles.link}>
        <UserAvatar login={participant.login} />
        <div>{participant.shortName}</div>
      </Link>
      {special && (
        <Icon
          className={styles.iconWrapper}
          size="sm"
          onClick={deleteUser}
          color="red"
          tooltipLabel={locale.tip.team.kickParticipant}
        >
          <CircleMinus />
        </Icon>
      )}
    </div>
  );
};

export default memo(MemberItem);
