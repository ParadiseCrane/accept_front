import { steps } from "./steps";
import { validate } from "./validate";

export const form = {
  steps,
  validate,
  title: "Title",
  author: "Author",
  shortDescription: "Short description",
  description: "Description",
  asSystem: "Send notification as system",
  broadcast: "Send notification to all users",
  preview: "Preview",
  previewHint:
    "Click to activate preview. This is how your notification will look for users. Click on it to open the full description.",
};
