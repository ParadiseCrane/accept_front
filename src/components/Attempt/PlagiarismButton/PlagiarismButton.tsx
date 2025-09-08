'use client';
import { IAttempt } from '@custom-types/data/IAttempt';
import { useLocale } from '@hooks/useLocale';
import { requestWithNotify } from '@utils/requestWithNotify';
import { FC, memo, useCallback, useState } from 'react';
import PlagiarismModal from '../PlagiarismModal/PlagiarismModal';
import { Button } from '@ui/basics';
import { sendRequest } from '@requests/request';

const PlagiarismButton: FC<{
  attempt: IAttempt;
  customStyle?: string;
}> = ({ attempt, customStyle }) => {
  const [isAIGen, setIsAIGen] = useState(attempt.is_ai_generated ?? false);
  const { locale } = useLocale();

  const [isOpen, toggleOpen] = useState(false);

  return (
    <>
      <Button
        kind={isAIGen ? 'positive' : 'negative'}
        variant="outline"
        onClick={() => toggleOpen(true)}
        size="sm"
        customStyle={customStyle}
      >
        {isAIGen
          ? locale.attempt.aiGenerated.markAsNotAIGenerated
          : locale.attempt.aiGenerated.markAsAIGenerated}
      </Button>
      <PlagiarismModal
        attemptSpec={attempt.spec}
        isAIGenerated={isAIGen}
        isOpen={isOpen}
        onClose={() => toggleOpen(false)}
        customStyle={customStyle}
        setIsAIGen={setIsAIGen}
      />
    </>
  );
};

export default memo(PlagiarismButton);
