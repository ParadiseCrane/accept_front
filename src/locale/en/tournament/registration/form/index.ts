import { steps } from './steps';

export const form = {
  steps,
  validation: {
    pin: 'Enter pin code',
    teamName: {
      empty: 'Enter team name',
      invalid: 'Team name has invalid symbols',
      maxLength: (limit: number) =>
        `Maximum team name length - ${limit}`,
      minLength: (limit: number) =>
        `Minimum team name length - ${limit}`,
    },
  },
};
