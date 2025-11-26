"use client";

import { useLocale } from "@hooks/useLocale";
import { useTipTapEditable } from "@hooks/useTipTapEditable";
import { Group, Menu } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { sendRequest } from "@requests/request";
import { Editor, BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";
import Button from "@ui/basics/Button/Button";
import TextArea from "@ui/basics/TextArea/TextArea";
import {
  errorNotification,
  newNotification,
} from "@utils/notificationFunctions";
import { useCallback, useRef, useState } from "react";

type Response = {
  style: string;
  text: string;
};

async function processStream(response: any) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullStory = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const jsonStr = line.substring(6);
        try {
          const data = JSON.parse(jsonStr);
          if (data.content) {
            fullStory += data.content;
          }
        } catch {}
      }
    }
  }
  return fullStory;
}

export const BubbleMenuComponent = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  const [style, setStyle] = useState("Сказка о царе Салтане");
  const [opened, setOpened] = useState<boolean>(false);
  const ref = useRef<{ from: number; to: number } | null>(null);
  const { isEditable, setEditable } = useTipTapEditable();

  const getSelectedText = useCallback((): string => {
    const from = ref.current?.from;
    const to = ref.current?.to;
    if (from && to) {
      return editor.state.doc.textBetween(from, to, "\n", "");
    }
    return "";
  }, [editor]);

  const stylizeText = useCallback(async () => {
    setEditable(false);
    try {
      const res = await fetch("/api/ai/text_style", {
        method: "POST",
        body: JSON.stringify({
          style,
          text: getSelectedText(),
        }),
      });

      const processedText = await processStream(res);

      const from = ref.current?.from;
      const to = ref.current?.to;

      if (from && to) {
        editor
          .chain()
          .focus()
          .insertContentAt({ from, to }, processedText)
          .run();
      }
    } catch {
      const id = newNotification({});
      errorNotification({
        id,
        title: locale.tiptap.stylize.error,
        autoClose: 10000,
      });
    } finally {
      setEditable(true);
      setOpened(false);
    }
  }, [editor]);

  return (
    <TipTapBubbleMenu editor={editor}>
      <Menu
        opened={opened || !isEditable}
        onChange={setOpened}
        onClose={() => setOpened(false)}
        transitionProps={{ transition: "scale-y" }}
      >
        <Menu.Target>
          <RichTextEditor.Control
            onClick={() => {
              setOpened((value) => !value);
            }}
            aria-label={locale.tiptap.stylize.hint}
            title={locale.tiptap.stylize.hint}
            disabled={!isEditable}
          >
            <Button
              onClick={() => {
                const { from, to } = editor.state.selection;
                ref.current = { from, to };
              }}
              type="button"
            >
              {locale.tiptap.stylize.hint}
            </Button>
          </RichTextEditor.Control>
        </Menu.Target>
        <Menu.Dropdown>
          <Group gap="sm" p="sm">
            <TextArea
              label={locale.tiptap.stylize.label}
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
