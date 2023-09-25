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

    participants: {
      empty: 'Team must have at least one member',
      max: (maxTeamSize: number) =>
        `Team size is over max team size of ${maxTeamSize}`,
    },
    capitan: 'Capitan must be among members',
  },
};
