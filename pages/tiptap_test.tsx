"use client";
import { NextPage } from "next";
import { useLocale } from "@hooks/useLocale";
import { TipTapEditor } from "@ui/basics/TipTapEditor/TipTapEditor";
import { Editor } from "@tiptap/core";
import { useState } from "react";
import { Divider } from "@mantine/core";

const TipTapTest: NextPage = () => {
  const { locale } = useLocale();
  const [content, setContent] = useState<string>("");
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "50px" }}>
      <TipTapEditor
        editorMode={true}
        content={""}
        onUpdate={(editor: Editor) => {
          const data = editor.getHTML();
          setContent(data);
        }}
        minHeight="100px"
      />
      <Divider m={"xl"} size={"xl"} />
      <div
        style={{
          borderStyle: "solid",
          borderColor: "black",
          borderWidth: "0.5px",
          padding: "15px",
        }}
      >
        {content}
      </div>
    </div>
  );
};
export default TipTapTest;
