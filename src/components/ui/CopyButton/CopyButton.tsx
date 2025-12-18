"use client";
import { ActionIcon } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { FC, memo } from "react";
import { IconChecks, IconCopy } from "@tabler/icons-react";

const CopyButton: FC<{ toCopy: string }> = ({ toCopy }) => {
  const clipboard = useClipboard({ timeout: 300 });
  return (
    <ActionIcon
      color={clipboard.copied ? "teal" : "var(--primary)"}
      onClick={() => {
        clipboard.copy(toCopy);
      }}
    >
      {clipboard.copied ? (
        <IconChecks width={20} height={20} />
      ) : (
        <IconCopy width={20} height={20} />
      )}
    </ActionIcon>
  );
};

export default memo(CopyButton);
