import { useLocale } from '@hooks/useLocale';
import { FC, memo } from 'react';
import { Button } from '@ui/basics';
import { IAIHint } from '@custom-types/data/IAttempt';

const AIHintButton: FC<{
  customStyle?: string;
  loading: boolean;
  isOpen: boolean;
  hint: IAIHint;
  onClick?: () => void;
}> = ({ loading, hint, isOpen, customStyle, onClick }) => {
  const { locale } = useLocale();

  const buttonText = loading
    ? locale.attempt.aiHint.generatingHint
    : hint.content.length
      ? isOpen
        ? locale.attempt.aiHint.hideHint
        : locale.attempt.aiHint.showHint
      : locale.attempt.aiHint.requestHint;

  return (
    <>
      <Button
        kind={'simple'}
        variant="outline"
        onClick={onClick}
        size="sm"
        customStyle={customStyle}
        disabled={loading}
      >
        {buttonText}
      </Button>
    </>
  );
};

export default memo(AIHintButton);
