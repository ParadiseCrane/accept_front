export const taskTest = {
  edit: 'Редактировать тест',
  add: 'Добавить тест',
  delete: { test: 'Удалить тест', group: 'Удалить группу тестов' },
  deleteConfidence: {
    test: (index: number) =>
      `Вы уверены, что хотите удалить тест #${index}?`,
    group: (index: number) =>
      `Вы уверены, что хотите удалить группу тестов #${index}?`,
  },
};
