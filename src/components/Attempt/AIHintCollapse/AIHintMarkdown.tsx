"use client";
import { FC, memo } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIHintMarkdown: FC<{
  hint?: string;
}> = ({ hint }) => {
  if (!hint) return null;
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{hint}</ReactMarkdown>
    </div>
  );
};

export default memo(AIHintMarkdown);
