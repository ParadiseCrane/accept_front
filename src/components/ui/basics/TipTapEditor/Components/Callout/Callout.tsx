"use client";
import React, { useRef, useEffect } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import {
  IconRocket,
  IconAlertTriangle,
  IconAlertCircle,
  IconAlertHexagon,
} from "@tabler/icons-react";

const getIconByType = (type: string) => {
  if (type === "danger") return <IconAlertHexagon />;
  if (type === "remark") return <IconAlertCircle />;
  if (type === "tip") return <IconRocket />;
  return <IconAlertTriangle />;
};

interface CalloutProps {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
}

export const Callout = ({ node }: CalloutProps) => {
  const type = node.attrs.type;

  return (
    <NodeViewWrapper
      as="aside"
      className={`starlight-aside ${type}`}
      data-drag-handle
    >
      <div className={`${type} callout_wrapper`}>
        <div className={"starlight-aside__icon"}>{getIconByType(type)}</div>
        <NodeViewContent as="div" className="starlight-aside__title-wrapper" />
      </div>
    </NodeViewWrapper>
  );
};
