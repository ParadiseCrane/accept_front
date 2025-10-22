import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useLocale } from "@hooks/useLocale";
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
  const { locale } = useLocale();
  const type = node.attrs.type ?? "warning";
  const title = locale.tiptap.getCalloutTitleByType(type);

  return (
    <NodeViewWrapper
      as="aside"
      className={`${type} starlight-aside`}
      aria-label={title}
    >
      <p className={`${type} starlight-aside__title`} aria-hidden="true">
        {getIconByType(type)}
        {/* <AlertTriangle
          className="starlight-aside__icon"
          width={16}
          height={16}
        /> */}
        {title}
      </p>
      <div className="starlight-aside__content">
        <NodeViewContent as="div" />
      </div>
    </NodeViewWrapper>
  );
};
