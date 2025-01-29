import { ITeamDisplayWithBanned } from '@custom-types/data/ITeam';
import { pureCallback } from '@custom-types/ui/atomic';
import { useLocale } from '@hooks/useLocale';
import { BanModal } from '@ui/modals';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useMemo } from 'react';
// import styles from './BunButton.module.css'

const BunButton: FC<{
  team: ITeamDisplayWithBanned;
  spec: string;
  onSuccess: pureCallback<void>;
}> = ({ team, spec, onSuccess }) => {
  const { locale, lang } = useLocale();

  const ban = useMemo(() => !team.banned, [team.banned]);

  const handleBan = useCallback(
    (reason: string) => {
      requestWithNotify<{ spec: string; banReason: string }, boolean>(
        `team/${ban ? 'ban' : 'unban'}/${spec}`,
        'DELETE',
        ban ? locale.notify.team.ban : locale.notify.team.unban,
        lang,
        () => '',
        { spec: team.spec, banReason: reason },
        () => {
          onSuccess();
        }
      );
    },
    [team, spec, locale, lang, onSuccess, ban]
  );

  return <BanModal ban={ban} onAction={handleBan} />;
};

export default memo(BunButton);
