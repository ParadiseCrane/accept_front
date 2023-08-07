export const tests = {
  test: 'Тест',
  group: {
    label: 'Группа',
    add: 'Добавить группу тестов',
  },
  separate_page: [
    'Внимание! Добавление и редактирование тестов производится на отдельной странице',
  ],
  addTest: 'Добавление теста',
  editTest: 'Редактирование теста',
  page: {
    main: 'Главная страница',
    order: 'Порядок тестов',
  },

  truncated: (truncate_limit: number) =>
    `Тест слишком велик: показаны первые ${truncate_limit} символов каждого поля`,
  prohibitEdit: (truncate_limit: number) =>
    `Вы не можете редактировать этот тест, так как длина его полей превышает ${truncate_limit} символов. Вы всё ещё можете удалить тест и создать новый, если это необходимо`,
};
