import { Node } from "@tiptap/core";

export const CalloutTitle = Node.create({
  name: "callout_title",

  group: "block",
  content: "text*",
  marks: "",
  defining: true,

  parseHTML() {
    return [{ tag: "p.starlight-aside__title", priority: 1000 }];
  },

  renderHTML() {
    return ["p", { class: "starlight-aside__title" }, 0];
  },
});
