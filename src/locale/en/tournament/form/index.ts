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
  maxTeamSize: 'Maximal number of participants in team',

  calendar: 'Select start and end dates',
  startDate: 'Start date',
  endDate: 'End date',
  freezeTableDate: 'Froze table date',

  moderators: 'Moderators',
  selectedModerators: 'Selected moderators',
  taskOrdering: 'Task order',
  zeroTask: 'Tasks were not added yet',
  security: {
    title: 'Access type',
    variants: ['Open registration', 'Pin code registration'],
  },
};
