import { steps } from './steps';
import { validation } from './validation';

export const form = {
  steps,
  validation,
  title: 'Title',
  description: 'Description',
  author: 'Author',
  allowRegistrationAfterStart: 'Registration after start',
  shouldPenalizeAttempt: 'Penalize attempts',
  assessmentType: {
    title: 'Assessment type',
    variants: ['Per test', 'Per task'],
  },

  calendar: 'Select start and end dates',
  startDate: 'Start date',
  startTime: 'Start time',
  endDate: 'End date',
  endTime: 'End time',
  freezeTableDate: 'Froze table date',
  freezeTableTime: 'Froze table time',

  moderators: 'Moderators',
  selectedModerators: 'Selected moderators',
  taskOrdering: 'Task order',
  zeroTask: 'Tasks were not added yet',
  security: {
    title: 'Access type',
    variants: ['Open registration', 'Pin code registration'],
  },
};
