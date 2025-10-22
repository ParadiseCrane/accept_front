"use client";
import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import {
  IconRocket,
  IconAlertTriangle,
  IconAlertCircle,
  IconAlertHexagon,
} from "@tabler/icons-react";

const getIconByType = (type: string) => {
  if (type === "danger") {
    return <IconAlertHexagon />;
  }

  if (type === "remark") {
    return <IconAlertCircle />;
  }

  if (type === "tip") {
    return <IconRocket />;
  }

  return <IconAlertTriangle />;
};

interface CalloutProps {
  node: any;
}

export const Callout: React.FC<CalloutProps> = ({ node }) => {
  const type = node.attrs.type;
  const title = node.attrs.title;

  return (
    <NodeViewWrapper
      as="aside"
      className={`${type} starlight-aside`}
      aria-label={title}
    >
      <p className={`${type} starlight-aside__title`} aria-hidden="true">
        {getIconByType(type)}
        {title}
      </p>
      <div className="starlight-aside__content">
        <NodeViewContent as="div" />
      </div>
    </NodeViewWrapper>
  );
};
