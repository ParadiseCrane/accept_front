import { Node, mergeAttributes } from "@tiptap/core";
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
  content:
    "callout_title (paragraph | image | bulletList | listItem | orderedList)+",
  defining: true,
  isolating: false,

  addAttributes() {
    return {
      type: {
        default: "warning",
      },
    };
  },

  parseHTML() {
    return [{ tag: "aside.starlight-aside" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "aside",
      mergeAttributes(HTMLAttributes, {
        class: `starlight-aside ${node.attrs.type}`,
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Callout);
  },

  addProseMirrorPlugins() {
    return [
      keymap({
        Backspace: (state, dispatch, view) => {
          const { $from } = state.selection;
          const parent = $from.node(-1);

          if (parent.type.name !== this.name) return false;

          if ($from.parentOffset > 0) return false;

          const calloutNode = parent;
          const firstChild = calloutNode.firstChild;
          const currentNode = $from.node();

          if (currentNode !== firstChild) return false;

          if (dispatch) {
            const start = $from.before($from.depth - 1);
            const end = $from.after($from.depth - 1);
            const tr = state.tr.delete(start, end);
            dispatch(tr.scrollIntoView());
            view?.focus();
          }

          return true;
        },
      }),
    ];
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
