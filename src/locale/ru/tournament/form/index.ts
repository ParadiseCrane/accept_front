import { steps } from './steps';
import { validation } from './validation';
export const form = {
  steps,
  validation,
  title: 'Название',
  author: 'Автор',
  description: 'Описание',
  allowRegistrationAfterStart: 'Регистрация после начала',
  shouldPenalizeAttempt: 'Штрафовать за попытки',
  assessmentType: {
    title: 'Тип оценивания',
    variants: [
      'Потестовая оценка',
      'Оценка по полностью сданной задаче',
    ],
  },

  security: {
    title: 'Тип доступа',
    variants: ['Открытая регистрация', 'Регистрация по пин-коду'],
  },
  maxTeamSize: 'Максимальное количество участников в команде',

  calendar: 'Выберите дату начала и окончания',
  startDate: 'Дата начала',
  endDate: 'Дата завершения',
  freezeTableDate: 'Дата заморозки таблицы',

  moderators: 'Модераторы',
  selectedModerators: 'Выбранные модераторы',
  taskOrdering: 'Порядок задач',
  zeroTask: 'В турнире пока нет ни одной задачи',
};
