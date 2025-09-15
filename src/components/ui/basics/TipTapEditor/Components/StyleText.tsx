"use client";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";
import { IconBallpen } from "@tabler/icons-react";

import { IconWrapper } from "./IconWrapper";
import { useEffect, useState } from "react";
import { Group, Menu, Text } from "@mantine/core";
import { useStream } from "@hooks/useStream";
import Button from "@ui/basics/Button/Button";
import TextArea from "@ui/basics/TextArea/TextArea";
import { useLocale } from "@hooks/useLocale";

export const StylizeText = ({ editor }: { editor: Editor }) => {
  const { locale } = useLocale();
  const [opened, setOpened] = useState(false);
  const [style, setStyle] = useState("Сказка о царе Салтане");

  const { data, chunk, error, startStream, loading, streaming } = useStream(
    "ai/text_style",
    "POST",
    { style: style, text: editor.getText() },
  );

  useEffect(() => {
    if (!loading && streaming) {
      setOpened(false);
      editor.commands.clearContent();
      editor.commands.insertContent("<p>");
    }
  }, [loading, streaming]);

  useEffect(() => {
    if (error || data == "") return;
    editor.commands.insertContent(chunk.replaceAll("\n\n", "<p>"));
  }, [editor, data, error]);

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      transitionProps={{ transition: "scale-y" }}
    >
      <Menu.Target>
        <RichTextEditor.Control
          onClick={() => {
            setOpened((value) => !value);
          }}
          aria-label={locale.tiptap.stylize.hint}
          title={locale.tiptap.stylize.hint}
          disabled={streaming}
        >
          <IconWrapper isActive={streaming} IconChild={IconBallpen} />
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
          />
          <Button loading={loading} onClick={startStream}>
            {locale.apply}
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};
