"use client";
import { ActionIcon } from "@mantine/core";
import Link from "next/link";
import { FC, memo } from "react";
import { IconEye } from "@tabler/icons-react";

const OpenTask: FC<{ spec: string }> = ({ spec }) => {
  return (
    <ActionIcon
      component={Link}
      href={`/task/${spec}`}
      target="_blank"
      tabIndex={5}
      color="var(--primary)"
      variant="transparent"
      size="lg"
    >
      <IconEye width={20} height={20} />
    </ActionIcon>
  );
};

export default memo(OpenTask);
