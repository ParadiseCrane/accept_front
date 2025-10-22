import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Callout } from "./Callout";

export const CalloutExtension = Node.create({
  name: "aside",

  group: "block",
  content: "block+",
  atom: false,

  addAttributes() {
    return {
      type: { default: "info" },
      title: { default: "Заметка" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "aside.starlight-aside",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Callout);
  },
});
