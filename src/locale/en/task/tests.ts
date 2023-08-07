export const tests = {
  test: 'Test',
  group: 'Group',
  separate_page: [
    'Attention! You can add and edit tests on separate page',
  ],
  addTest: 'Add test',
  editTest: 'Update test',
  page: {
    main: 'Main page',
    order: 'Tests order',
  },
  truncated: (truncate_limit: number) =>
    `Test is too long: only first ${truncate_limit} symbols are shown`,
  prohibitEdit: (truncate_limit: number) =>
    `You can not edit this test, as its length is greater than ${truncate_limit} symbols. You still can delete test and create a new one if it is necessary`,
};
