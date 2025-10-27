import { Node, mergeAttributes, CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { keymap } from "prosemirror-keymap";
import { TextSelection } from "prosemirror-state";
import { Callout } from "./Callout";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aside: {
      exitAside: () => ReturnType;
    };
  }
}

export const CalloutExtension = Node.create({
  name: "aside",

  group: "topLevel",
  content: "block+",
  defining: true,
  isolating: false,
  selectable: true,

  addAttributes() {
    return {
      type: { default: "info" },
      title: { default: "Заметка" },
    };
  },

  parseHTML() {
    return [{ tag: "aside.starlight-aside" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["aside", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Callout);
  },

  addCommands() {
    return {
      exitAside:
        () =>
        ({ state, dispatch }: CommandProps) => {
          const { $from } = state.selection;
          const parent = $from.node(-1);
          if (parent.type.name !== this.name) return false;

          const endPos = $from.end($from.depth - 1);

          if (dispatch) {
            const paragraph = state.schema.nodes.paragraph.create();
            const tr = state.tr.insert(endPos, paragraph);
            tr.setSelection(TextSelection.near(tr.doc.resolve(endPos + 1)));
            dispatch(tr.scrollIntoView());
          }
          return true;
        },
    };
  },
});

export const exitAsideOnEnter = keymap({
  Enter: (state, dispatch, view) => {
    const { $from } = state.selection;
    const parent = $from.node(-1);
    if (parent.type.name !== "aside") return false;
    if ($from.pos < $from.end()) return false;

    const paragraph = state.schema.nodes.paragraph.create();
    const endPos = $from.end($from.depth - 1);
    const tr = state.tr.insert(endPos, paragraph);
    tr.setSelection(TextSelection.near(tr.doc.resolve(endPos + 1)));
    dispatch?.(tr.scrollIntoView());
    view?.focus();
    return true;
  },
});
