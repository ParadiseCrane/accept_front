export const validation = {
  title: 'Task must have title at least 5 characters',
  tags: 'Task must have at least 1 tag',
  description: 'Task must have description at least 20 characters',
  inputFormat: 'Task must have input description',
  outputFormat: 'Task must have output description',
  constraints: {
    memory: 'Memory must be between 0Mb and 1024Mb',
    time: 'Time must be between 0 and 60 seconds',
  },
  complexity: {
    least: 'Complexity must be at least 1%',
    most: 'Complexity must be at most 100%',
  },
  examples: {
    number: 'Task must include at least 1 example',
    empty: 'Task can not have empty examples',
  },
  tests: {
    number: 'Task must include at least 1 test',
    empty: 'Task can not have empty tests',
    text: 'Text task can have only one test',
    tooLarge: 'The total size of tests should not exceed 2 Mb',
  },
  hintContent: 'You add hint, but hint content is empty',
  checkerCode: 'You used checker, but forget to add checker`s code',
  hintAlarm: 'Value must not be less then 0',
};
