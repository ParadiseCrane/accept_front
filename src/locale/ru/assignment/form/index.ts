import { steps } from './steps';
import { validation } from './validation';

export const form = {
  steps,
  validation,
  infinite: 'Бесконечный',
  creator: 'Создатель',
  author: 'Автор',
  startTime: 'Время начала',
  endTime: 'Время окончания',
  frozeTime: 'Время заморозки таблицы',
  calendar: 'Выберите дату начала и окончания',
  status: {
    text: 'Статус',
    0: 'Ожидается',
    1: 'В процессе',
    2: 'Завершён',
  },
};
