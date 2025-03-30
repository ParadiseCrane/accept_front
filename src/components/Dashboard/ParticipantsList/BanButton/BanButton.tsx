import { IParticipant } from '@custom-types/data/IUser';
import { useLocale } from '@hooks/useLocale';
import { BanModal } from '@ui/modals';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback } from 'react';

const BanButton: FC<{
  user: IParticipant;
  spec: string;
  onSuccess: () => void;
}> = ({ user, spec, onSuccess }) => {
  const { locale, lang } = useLocale();

  let ban = !user.banned;

  const handleBan = useCallback(
    (banReason: string) => {
      requestWithNotify(
        `tournament/participants/${ban ? 'ban' : 'unban'}/${spec}`,
        'POST',
        ban
          ? locale.notify.tournament.banUser
          : locale.notify.tournament.unbanUser,
        lang,
        () => '',
        {
          login: user.login,
          banReason,
        },
        onSuccess
      );
    },
    [ban, spec, locale, lang, user.login, onSuccess]
  );

  return (
    <>
      <BanModal ban={ban} onAction={handleBan} />
    </>
  );
};

export default memo(BanButton);
