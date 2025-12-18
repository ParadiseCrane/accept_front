"use client";
import { ITreeUnit } from "@custom-types/data/ICourse";
import { useLocale } from "@hooks/useLocale";
import { ActionIcon } from "@mantine/core";
import { Tip } from "@ui/basics";
import { FC } from "react";
import { IconCaretDown, IconCaretRight } from "@tabler/icons-react";

interface IToggleVisibilityButtonProps {
  currentUnit: ITreeUnit;
  canToggleChildrenVisibility: ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => boolean;
  toggleChildrenVisibility: ({
    currentUnit,
  }: {
    currentUnit: ITreeUnit;
  }) => void;
}

export const ToggleVisibilityButton: FC<IToggleVisibilityButtonProps> = ({
  currentUnit,
  canToggleChildrenVisibility,
  toggleChildrenVisibility,
}) => {
  const { locale } = useLocale();
  if (canToggleChildrenVisibility({ currentUnit })) {
    return (
      <Tip
        label={
          currentUnit.childrenVisible
            ? locale.ui.courseTree.hideChildren
            : locale.ui.courseTree.showChildren
        }
      >
        <ActionIcon
          variant="transparent"
          size={"sm"}
          onClick={() => {
            toggleChildrenVisibility({ currentUnit });
          }}
          style={{
            display: canToggleChildrenVisibility({ currentUnit }) ? "" : "none",
          }}
        >
          {currentUnit.childrenVisible ? <IconCaretDown /> : <IconCaretRight />}
        </ActionIcon>
      </Tip>
    );
  }

  return (
    <ActionIcon variant="transparent" size={"sm"} disabled>
      <IconCaretRight />
    </ActionIcon>
  );
};
