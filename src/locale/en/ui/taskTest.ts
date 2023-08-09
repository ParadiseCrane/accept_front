export const taskTest = {
  edit: 'Edit test',
  add: 'Add test',
  delete: { test: 'Delete test', group: 'Delete test group' },
  deleteConfidence: {
    test: (index: number) =>
      `Are you sure you want to delete the test #${index}?`,
    group: (index: number) =>
      `Are you sure you want to delete the test group #${index}?`,
  },
};
