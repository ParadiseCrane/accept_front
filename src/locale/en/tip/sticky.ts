export const sticky = {
  task: {
    add: "Create new task",
    edit: "Edit the task",
    delete: "Delete the task",
    hint: "Show the hint",
    tests: "Show tests",
  },
  assignment: {
    add: "Create new assignment",
    edit: "Edit the assignment",
    delete: "Delete the assignment",
    dashboard: "Assignment dashboard",
  },
  assignmentSchema: {
    add: "Create new assignment schema",
    edit: "Edit the assignment schema",
    delete: "Delete the assignment schema",
  },
  group: {
    add: "Create new group",
    edit: "Edit the group",
    delete: "Delete the group",
  },
  tournament: {
    add: "Create new tournament",
    edit: "Edit the tournament",
    delete: "Delete the tournament",
    myTeam: "My team",
    pin: "Pin code",
    dashboard: "Tournament dashboard",
    results: "Results table",
  },
  tests: {
    download: "Download tests",
  },
  attempt: {
    ban: "Ban the attempt",
    unban: "Unban the attempt",
  },
  user: {
    edit: "Edit the user",
    delete: "Delete the user",
  },
  team: {
    delete: "Delete the team",
  },
  course: {
    edit: (kind: "course" | "unit" | "lesson"): string => {
      if (kind === "lesson") return "Edit lesson";
      if (kind === "unit") return "Edit unit";
      return "Edit course";
    },
    delete: "Delete course",
    dashboard: (kind: "course" | "unit" | "lesson"): string => {
      if (kind === "lesson") return "Lesson  dashboard";
      if (kind === "unit") return "Unit dashboard";
      return "Course dashboard";
    },
    add: "Create course",
    createTask: "Create task",
  },
};
