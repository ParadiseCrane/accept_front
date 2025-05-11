import { IAttempt } from '@custom-types/data/IAttempt';
import { useLocale } from '@hooks/useLocale';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useState } from 'react';
import PlagiarismModal from '../PlagiarismModal/PlagiarismModal';
import { Button } from '@ui/basics';

const PlagiarismButton: FC<{
  attempt: IAttempt;
  customStyle?: string;
}> = ({ attempt, customStyle }) => {
  const { locale } = useLocale();

  const [isOpen, toggleOpen] = useState(false);

  // const handleBan = useCallback(
  //   (banReason: string) => {
  //     requestWithNotify(
  //       `tournament/participants/${ban ? 'ban' : 'unban'}/${spec}`,
  //       'POST',
  //       ban
  //         ? locale.notify.tournament.banUser
  //         : locale.notify.tournament.unbanUser,
  //       lang,
  //       () => '',
  //       {
  //         login: user.login,
  //         banReason,
  //       },
  //       onSuccess
  //     );
  //   },
  //   [ban, spec, locale, lang, user.login, onSuccess]
  // );

  const handleBan = () => {};

  const handleUnban = () => {};

  return (
    <>
      <Button
        kind={attempt.is_ai_generated ? 'positive' : 'negative'}
        variant="outline"
        onClick={() => toggleOpen(true)}
        size="sm"
        customStyle={customStyle}
      >
        {attempt.is_ai_generated
          ? locale.attempt.aiGenerated.markAsNotAIGenerated
          : locale.attempt.aiGenerated.markAsAIGenerated}
      </Button>
      <PlagiarismModal
        isAIGenerated={attempt.is_ai_generated ?? false}
        isOpen={isOpen}
        onClose={() => toggleOpen(false)}
        action={attempt.is_ai_generated ? handleUnban : handleBan}
        customStyle={customStyle}
      />
    </>
  );
};

export default memo(PlagiarismButton);
