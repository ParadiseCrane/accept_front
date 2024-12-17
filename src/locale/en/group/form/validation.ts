export const validation = {
  name: (number: number) =>
    `Minimum length of group name is ${number} characters`,
  members: (number: number) =>
    `Minimum number of participants in a group is ${number} participants`,
};
