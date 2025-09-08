"use client";
import { useLocale } from "@hooks/useLocale";
import { FC, memo } from "react";
import { Button } from "@ui/basics";

const AIHintButton: FC<{
  customStyle?: string;
  loading: boolean;
  onClick?: () => void;
}> = ({ loading, customStyle, onClick }) => {
  const { locale } = useLocale();

  return (
    <Button
      kind={"simple"}
      variant="outline"
      onClick={onClick}
      size="sm"
      customStyle={customStyle}
      disabled={loading}
    >
      {locale.attempt.aiHint.requestHint}
    </Button>
  );
};

export default memo(AIHintButton);
