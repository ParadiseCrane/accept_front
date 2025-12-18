"use client";
import { ITreeUnit } from "@custom-types/data/ICourse";
import { useLocale } from "@hooks/useLocale";
import { ActionIcon } from "@mantine/core";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import { Tip } from "@ui/basics";
import { FC } from "react";

interface IToggleOpennessButtonProps {
  styles: any;
  currentUnit: ITreeUnit;
  toggleOpennessTreeUnit: ({ currentUnit }: { currentUnit: ITreeUnit }) => void;
  canToggleOpennessTreeUnit: boolean;
}

export const ToggleOpennessButton: FC<IToggleOpennessButtonProps> = ({
  currentUnit,
  canToggleOpennessTreeUnit,
  toggleOpennessTreeUnit,
}) => {
  const { locale } = useLocale();
  return (
    <Tip
      label={
        currentUnit.isOpen
          ? locale.ui.courseTree.closeElementAndChildren
          : locale.ui.courseTree.openElementAndChildren
      }
    >
      <ActionIcon
        variant="transparent"
        onClick={() => {
          toggleOpennessTreeUnit({ currentUnit });
        }}
        disabled={!canToggleOpennessTreeUnit}
      >
        {currentUnit.isOpen ? <IconLockOpen /> : <IconLock />}
      </ActionIcon>
    </Tip>
  );
};
