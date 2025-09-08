import { modals } from "./modals";
import { list } from "./list";
import { lesson } from "./lesson";

export const course = {
  courseImage: "Course image",
  nextShortcut: "You can use a keyboard shortcut ",
  prevShortcut: "You can use a keyboard shortcut ",
  selectImagePreset: "Select image preset",
  selectGroup: "Select group",
  presetName: "Preset name",
  groupName: "Group name",
  presetNotFound: "No preset found",
  groupNotFound: "No group found",
  nameAndStructure: "Name and structure",
  courseStructure: "Course structure",
  description: "Description",
  backToCoursesTip: "Go back to list of courses",
  backToCourseTip: "Go back to the course",
  backToCoursesButton: "Back to courses",
  backToCourseButton: "Back to the course",
  presentNameToLocale: (key: string) => {
    return (
      new Map<string, string>(
        Object.entries({
          math: "Math",
          networks: "Networks",
          robotics: "Robotics",
          coworking: "Coworking",
          abstract: "Abstract",
        }),
      ).get(key.toLowerCase()) ?? key
    );
  },
  contents: (kind: "unit" | "course"): string => {
    if (kind === "unit") return "Unit contents";
    return "Course contents";
  },
  modals,
  list,
  lesson,
};
