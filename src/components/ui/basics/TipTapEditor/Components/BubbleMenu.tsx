"use client";

import { useLocale } from "@hooks/useLocale";
import { useTipTapBubbleMenu } from "@hooks/useTipTapBubbleMenu";
import { Editor, BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";
import { Button as MantineButton } from "@mantine/core";
import { IconBallpen } from "@tabler/icons-react";
import styles from "./BubbleMenu.module.css";
import clsx from "clsx";

export const BubbleMenuComponent = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  const { setSelectedRange, setModalVisible, isModalVisible } =
    useTipTapBubbleMenu();

  return (
    <TipTapBubbleMenu
      editor={editor}
      className={clsx(isModalVisible && styles.invisible)}
    >
      <MantineButton
        variant="default"
        size="sm"
        radius="xl"
        onClick={() => {
          const { from, to } = editor.state.selection;
          setSelectedRange({ from, to });
          setModalVisible(true);
        }}
      >
        <>
          <IconBallpen style={{ paddingRight: "5px" }} />
          {locale.tiptap.stylize.hint}
        </>
      </MantineButton>
    </TipTapBubbleMenu>
  );
};
