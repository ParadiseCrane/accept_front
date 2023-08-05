import { steps } from './steps';
import { validation } from './validation';

export const form = {
  steps,
  validation,
  title: 'Название',
  description: 'Описание',
  taskOrdering: {
    title: 'Выберите порядок задач',
  },
  taskSelector: {
    available: 'Все задачи',
    used: 'Выбранные задачи',
  },
};
