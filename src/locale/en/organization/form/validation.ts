export const validation = {
  spec: (number: number) =>
    `Minimum length of organization spec is ${number} characters`,
  name: (number: number) =>
    `Minimum length of organization name is ${number} characters`,
  description: 'Organization description must not be empty',
};
