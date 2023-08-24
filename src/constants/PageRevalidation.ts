export const DEFAULT_TIME = 10;

export const REVALIDATION_TIME = {
  assignment: {
    page: 60,
    add: DEFAULT_TIME,
    edit: DEFAULT_TIME,
  },
  assignment_schema: {
    page: DEFAULT_TIME,
    add: DEFAULT_TIME,
    edit: DEFAULT_TIME,
  },
  tournament: {
    add: DEFAULT_TIME,
    edit: DEFAULT_TIME,
  },
  attempt: {
    testing: DEFAULT_TIME,
    finished: 60,
  },
  group: {
    edit: DEFAULT_TIME,
  },
  task: {
    page: 60,
    edit: DEFAULT_TIME,
    tests: 60,
  },
  dashboard: {
    assignment: 10 * 60 * 60,
    tournament: 10 * 60 * 60,
  },
  rating: {
    page: 10,
  },
  team: {
    page: 10,
  },
}; // in seconds
