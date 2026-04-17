"use client";

import { Node } from "@tiptap/core";
import { MathExtension } from "@aarkue/tiptap-math-extension";
import { useLocale } from "@hooks/useLocale";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { FloatingMenu } from "@tiptap/extension-floating-menu";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { History } from "@tiptap/extension-history";
import { Italic } from "@tiptap/extension-italic";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Text } from "@tiptap/extension-text";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Editor, useEditor, BubbleMenu } from "@tiptap/react";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import { ImageResize } from "tiptap-extension-resize-image";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";

import { AlignGroupCollapsed, AlignGroupSeparate } from "./Components/Align";
import { ClearFormattingButton } from "./Components/ClearFormattingButton";
import { ColorPickerButton } from "./Components/ColorPickerButton";
import { HighLightColorButton } from "./Components/HighlightColorButton";
import { LinkButton, UnlinkButton } from "./Components/LinkButton";
import { ToggleBlockquote } from "./Components/ToggleBlockquote";
import { ToggleBold } from "./Components/ToggleBold";
import {
  HeadingsGroupCollapsed,
  HeadingsGroupSeparate,
} from "./Components/ToggleHeadings";
import { ToggleItalic } from "./Components/ToggleItalic";
import { ToggleBulletList, ToggleOrderedList } from "./Components/ToggleList";
import { ToggleStrikethrough } from "./Components/ToggleStrikethrough";
import {
  ToggleSubscript,
  ToggleSuperscript,
} from "./Components/ToggleSubSuper";
import { ToggleUnderline } from "./Components/ToggleUnderline";
import { ToolbarDivider } from "./Components/ToolbarDivider";
import { RedoButton, UndoButton } from "./Components/UndoRedo";
import styles from "./TipTapEditor.module.css";
import {
  CalloutExtension,
  exitAsideOnEnter,
} from "./Components/Callout/Extension";
import { AddCalloutButton } from "./Components/AddCallout";
import { CalloutTitle } from "./Components/Callout/CalloutTitle";

import { StylizeText } from "./Components/StyleText";
import { ToggleCodeBlock } from "./Components/ToggleCodeBlock";
import { InsertLatexExpression } from "./Components/InsertLatex";
import { InsertImageAsFile, InsertImageAsUrl } from "./Components/InsertImage";
import { GenerateImage } from "./Components/GenerateImage";
import { BubbleMenuComponent } from "./Components/BubbleMenu";
import { useTipTapBubbleMenu } from "@hooks/useTipTapBubbleMenu";
import { useEffect } from "react";
import { StylizeTextModal } from "./Components/Modals/StylizeTextModal";

export const TipTapEditor = ({
  editorMode,
  content,
  minHeight,
  form,
  name,
  onUpdate,
  onBlur,
}: {
  editorMode: boolean;
  content: string;
  minHeight?: string;
  form?: any;
  name?: any;
  onUpdate: (editor: Editor) => void;
  onBlur?: any;
}) => {
  const { isEditable } = useTipTapBubbleMenu();
  const isTipTapEditable = editorMode && isEditable;
  const lowlight = createLowlight();

  lowlight.register("html", html);
  lowlight.register("css", css);
  lowlight.register("js", js);
  lowlight.register("ts", ts);
  lowlight.register("python", python);
  lowlight.register("csharp", csharp);

  const { locale } = useLocale();

  const languages = [
    {
      nameAsString: locale.tiptap.defaultLanguage,
      name: "default",
      nameAsFn: null,
    },
    { nameAsString: "HTML", name: "html", nameAsFn: html },
    { nameAsString: "CSS", name: "css", nameAsFn: css },
    { nameAsString: "JavaScript", name: "js", nameAsFn: js },
    { nameAsString: "TypeScript", name: "ts", nameAsFn: ts },
    { nameAsString: "Python", name: "python", nameAsFn: python },
    { nameAsString: "C#", name: "csharp", nameAsFn: csharp },
  ];

  const calloutTypes = [
    {
      value: "warning",
      label: locale.tiptap.getCalloutTitleByType("warning"),
    },
    {
      value: "remark",
      label: locale.tiptap.getCalloutTitleByType("remark"),
    },
    {
      value: "tip",
      label: locale.tiptap.getCalloutTitleByType("tip"),
    },
    {
      value: "danger",
      label: locale.tiptap.getCalloutTitleByType("danger"),
    },
  ];

  const registerLanguages = () => {
    for (let i = 1; i < languages.length; i++) {
      lowlight.register(languages[i].nameAsString, languages[i].nameAsFn!);
    }
  };

  registerLanguages();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      CalloutExtension,
      CalloutTitle,
      MathExtension.configure({ evaluation: false }),
      ImageResize,
      Blockquote,
      Link,
      Bold,
      BulletList,
      Code,
      CodeBlockLowlight.configure({
        lowlight: lowlight,
      }),
      Color,
      Document,
      Dropcursor,
      FloatingMenu,
      Heading,
      Highlight.configure({ multicolor: true }),
      History,
      Italic,
      ListItem,
      OrderedList,
      Paragraph,
      Strike,
      Subscript,
      Superscript,
      Text,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Underline,
      HardBreak,
      Node.create({
        name: "doc",
        topNode: true,
        content: "(block | topLevel)+",
      }),
    ],
    content,
    editable: editorMode,
    onUpdate: () => {
      onUpdate(editor!);
    },
    onCreate: () => {
      editor?.registerPlugin(exitAsideOnEnter);
    },
    onBlur: onBlur,
  });

  useEffect(() => {
    editor?.setEditable(isTipTapEditable);
    editor?.extensionManager.extensions.push(
      BubbleMenuExtension.configure({
        element: document.querySelector(".menu") as HTMLElement,
      }),
    );
  }, [isTipTapEditable]);

  const outlineClass = editorMode ? "outline-tiptap" : "";

  return (
    <RichTextEditor editor={editor}>
      {editor && <StylizeTextModal editor={editor} />}
      {editorMode && editor && (
        <RichTextEditor.Toolbar
          sticky={true}
          stickyOffset={60}
          className={styles.toolbar}
        >
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToggleBold editor={editor} />
            <ToggleItalic editor={editor} />
            <ToggleUnderline editor={editor} />
            <ToggleStrikethrough editor={editor} />
            <ClearFormattingButton editor={editor} />
            <ColorPickerButton editor={editor} />
            <HighLightColorButton editor={editor} />
          </RichTextEditor.ControlsGroup>
          <ToolbarDivider />
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <ToggleCodeBlock editor={editor} languages={languages} />
            <InsertLatexExpression editor={editor} />
            <InsertImageAsFile editor={editor} />
            <InsertImageAsUrl editor={editor} />
          </RichTextEditor.ControlsGroup>
          <ToolbarDivider />
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <HeadingsGroupSeparate
              editor={editor}
              className={styles.headings_group_separate}
            />
            <HeadingsGroupCollapsed
              editor={editor}
              className={styles.headings_group_collapsed}
            />
          </RichTextEditor.ControlsGroup>
          <ToolbarDivider />
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <AddCalloutButton editor={editor} types={calloutTypes} />
            <ToggleBlockquote editor={editor} />
            <ToggleBulletList editor={editor} />
            <ToggleOrderedList editor={editor} />
            <ToggleSubscript editor={editor} />
            <ToggleSuperscript editor={editor} />
          </RichTextEditor.ControlsGroup>
          <ToolbarDivider />
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <LinkButton editor={editor} />
            <UnlinkButton editor={editor} />
          </RichTextEditor.ControlsGroup>
          <ToolbarDivider />
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <AlignGroupSeparate
              editor={editor}
              className={styles.align_group_separate}
            />
            <AlignGroupCollapsed
              editor={editor}
              className={styles.align_group_collapsed}
            />
          </RichTextEditor.ControlsGroup>
          <ToolbarDivider />
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <UndoButton editor={editor} />
            <RedoButton editor={editor} />
          </RichTextEditor.ControlsGroup>
          {/* AI-FEATURE FLAG */}
          <ToolbarDivider />
          <RichTextEditor.ControlsGroup className={styles.toolbar_group}>
            <StylizeText editor={editor} />
            {/* <GenerateImage editor={editor} /> */}
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      )}
      {editor && <BubbleMenuComponent editor={editor} />}
      <RichTextEditor.Content
        className={`${styles.content} ${outlineClass}`}
        style={{ minHeight: minHeight }}
      />
    </RichTextEditor>
  );
};
