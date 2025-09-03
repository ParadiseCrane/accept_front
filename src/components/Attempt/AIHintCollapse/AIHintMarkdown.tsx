'use client';
import { FC, memo } from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIHintMarkdown: FC<{
  hint?: string;
}> = ({ hint }) => {
  if (!hint) return null;
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint}</ReactMarkdown>;
};

export default memo(AIHintMarkdown);
