import { description } from './description';
import { form } from './form';
import { list } from './list';
import { modals } from './modals';
import { tests } from './tests';

export const task = {
  send: 'Отправка',
  answer: 'Ответ',
  results: 'Результаты',
  description,

  submit: 'Отправить',
  status: {
    error: 'Ошибка при отправке',
    ok: 'Попытка успешно отправлена',
  },
  constraints: {
    time: 'Время',
    memory: 'Память',
  },
  complexity: 'Сложность',

  modals,
  list,
  form,
  tests,
};
