export const DEFAULT_TIME = 10;

export const REVALIDATION_TIME = {
  tournament: {
    add: DEFAULT_TIME,
    edit: DEFAULT_TIME,
  },
  dashboard: {
    assignment: 10 * 60 * 60,
    tournament: 10 * 60 * 60,
    course: 10 * 60 * 60,
  },
  rating: {
    page: 10,
  },
}; // in seconds
