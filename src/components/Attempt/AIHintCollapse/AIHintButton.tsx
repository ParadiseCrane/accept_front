import { useLocale } from '@hooks/useLocale';
import { FC, memo } from 'react';
import { Button } from '@ui/basics';

const AIHintButton: FC<{
  customStyle?: string;
  loading: boolean;
  isOpen: boolean;
  hintText: string;
  onClick?: () => void;
}> = ({ loading, hintText, isOpen, customStyle, onClick }) => {
  const { locale } = useLocale();

  const buttonText = loading
    ? locale.attempt.aiHint.generatingHint
    : hintText.length
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
