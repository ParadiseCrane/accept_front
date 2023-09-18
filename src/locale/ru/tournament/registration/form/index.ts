import { steps } from './steps';

export const form = {
  steps,
  validation: {
    pin: 'Введите пин-код',
    teamName: {
      empty: 'Введите название команды',
      invalid: 'Название команды содержит недопустимые символы',
      maxLength: (limit: number) =>
        `Максимальная длина названия команды - ${limit}`,
      minLength: (limit: number) =>
        `Минимальная длина названия команды - ${limit}`,
    },
    participants: 'В команде должен быть хотя бы 1 участник',
    capitan: 'Капитан должен быть среди участников',
  },
};
