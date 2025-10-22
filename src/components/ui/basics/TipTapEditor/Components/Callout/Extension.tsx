"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Plugin, PluginKey } from "prosemirror-state";
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

  addProseMirrorPlugins(): Plugin<any>[] {
    return [
      new Plugin({
        key: new PluginKey("noNestedAside"),
        filterTransaction: (tr) => {
          let valid = true;
          tr.doc.descendants((node, _pos, parent) => {
            if (node.type.name === "aside" && parent?.type.name === "aside") {
              valid = false;
              return false;
            }
          });
          return valid;
        },
      }) as Plugin<any>,
    ];
  },
});
