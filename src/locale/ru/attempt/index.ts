export const attempt = {
  date: 'Дата',
  task: 'Задача',
  language: 'Язык',
  result: 'Результат',
  verdict: 'Вердикт',
  status: 'Статус',
  banReason: 'Причина бана',
  author: 'Автор',
  notAllowed: 'Доступ ограничен',
  constraints: {
    time: 'Ограничение по времени',
    memory: 'Ограничение по памяти',
  },
  time: 'Время',
  memory: 'Память',
  test: 'Тест',
  statuses: [
    'В очереди',
    'Тестируется',
    'Протестирована',
    'Забанена',
  ],
  pages: {
    info: 'Информация',
    code: 'Посылка',
  },
  ban: {
    title: 'Забанить попытку',
    action: 'Забанить',
    reason: 'Кратко укажите причину бана',
    request: {
      loading: 'Загрузка...',
      success: 'Попытка была успешно забанена',
      error: 'Ошибка при бане попытки',
    },
    validation: {
      reason: {
        tooShort: 'Причина слишком коротка',
      },
    },
  },
  unban: {
    title: 'Разбанить попытку',
    action: 'Разбанить',
    previousBanDate: 'Дата бана:',
    previousBanRequester: 'Инициатор:',
    previousBanReason: 'Причина:',
    request: {
      loading: 'Загрузка...',
      success: 'Попытка была успешно разбанена',
      error: 'Ошибка при разбане попытки',
    },
  },
};
