"use client";

import { useLocale } from "@hooks/useLocale";
import { useTipTapBubbleMenu } from "@hooks/useTipTapBubbleMenu";
import { Group, Menu } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor, BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";
import Button from "@ui/basics/Button/Button";
import TextArea from "@ui/basics/TextArea/TextArea";
import { useCallback, useState } from "react";
import { Button as MantineButton } from "@mantine/core";
import { IconBallpen } from "@tabler/icons-react";

export const BubbleMenuComponent = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  const [style, setStyle] = useState("Сказка о царе Салтане");
  const {
    isEditable,
    getStylizedText,
    isModalVisible,
    selectedRange,
    setModalVisible,
    setSelectedRange,
  } = useTipTapBubbleMenu();

  const stylizeText = useCallback(async () => {
    const from = selectedRange.from;
    const to = selectedRange.to;
    if (from && to) {
      const processedText = await getStylizedText({
        style,
        selectedText: editor.state.doc.textBetween(from, to, "\n", ""),
      });

      editor.chain().focus().insertContentAt({ from, to }, processedText).run();
    }
  }, [editor, selectedRange, getStylizedText]);

  return (
    <TipTapBubbleMenu editor={editor}>
      <Menu
        opened={isModalVisible}
        onChange={setModalVisible}
        onClose={() => setModalVisible(false)}
        transitionProps={{ transition: "scale-y" }}
      >
        <Menu.Target>
          <RichTextEditor.Control
            onClick={() => {
              setModalVisible(true);
            }}
            aria-label={locale.tiptap.stylize.hint}
            title={locale.tiptap.stylize.hint}
            disabled={!isEditable}
          >
            <MantineButton
              variant="default"
              size="sm"
              radius="xl"
              onClick={() => {
                const { from, to } = editor.state.selection;
                setSelectedRange({ from, to });
              }}
            >
              <>
                <IconBallpen style={{ paddingRight: "5px" }} />
                {locale.tiptap.stylize.hint}
              </>
            </MantineButton>
          </RichTextEditor.Control>
        </Menu.Target>
        <Menu.Dropdown>
          <Group gap="sm" p="sm">
            <TextArea
              label={locale.tiptap.stylize.labelSelected}
              placeholder={locale.tiptap.stylize.placeholder}
              minRows={3}
              value={style}
              onChange={(event) => setStyle(event.currentTarget.value)}
              disabled={!isEditable}
            />
            <Button loading={!isEditable} onClick={stylizeText}>
              {locale.apply}
            </Button>
          </Group>
        </Menu.Dropdown>
      </Menu>
    </TipTapBubbleMenu>
  );
};
